from flask import Flask, request
from flask_compress import Compress
import requests
import concurrent.futures
import itertools

app = Flask(__name__, static_folder='build/', static_url_path='/')
Compress(app)

def getLeagueInfo(league, user_id):
    users = requests.get(
        'https://api.sleeper.app/v1/league/' + str(league['league_id']) + '/users', timeout=3).json()
          
    rosters = requests.get(
        'https://api.sleeper.app/v1/league/' + str(league['league_id']) + '/rosters').json()
        
    userRoster = next(iter([x for x in rosters if x['owner_id'] == user_id or 
        (x['co_owners'] != None and user_id in x['co_owners'])]), None)
    league = {
            'league_id': league['league_id'],
            'name': league['name'],
            'avatar': league['avatar'],
            'total_rosters': league['total_rosters'],
            'wins': userRoster['settings']['wins'] if userRoster != None else '-',
            'losses': userRoster['settings']['losses'] if userRoster != None else '-',
            'ties': userRoster['settings']['ties'] if userRoster != None else '-',
            'fpts': float(str(userRoster['settings']['fpts']) + 
                "." + str(userRoster['settings']['fpts_decimal'])) 
                    if userRoster != None and 'fpts_decimal' in userRoster['settings'].keys() else 
                    0,
            'fpts_against': float(str(userRoster['settings']['fpts_against']) + 
                "." + str(userRoster['settings']['fpts_against_decimal'])) 
                if userRoster != None and 'fpts_against' in userRoster['settings'].keys() else 
                0,
            'rosters': rosters,
            'users': users,
            'userRoster': userRoster
        }
    return league
          
def getPlayerShares(leagues, user_id, players_all):

    return leagues

@app.route('/user/<username>')
def getUser(username):
    user = requests.get(
        'https://api.sleeper.app/v1/user/' + str(username), timeout=3
    ).json()
    if (user == None):
        user = 'Invalid'

    return user

@app.route('/leagues/<user_id>', methods=['GET', 'POST'])
def getLeagues(user_id):
    leagues = requests.get('https://api.sleeper.app/v1/user/' + str(user_id) + '/leagues/nfl/2022', timeout=3).json()
    
    with concurrent.futures.ProcessPoolExecutor(max_workers=10) as executor:
        leagues_detailed = list(executor.map(getLeagueInfo, leagues, itertools.repeat(user_id)))
        
    return leagues_detailed
    
    
@app.route('/leaguemates', methods=['POST'])
def getLeaguemates():
    leagues = request.get_json()['leagues']
    user = request.get_json()['user']
    leaguemates = list(map(lambda x: list(map(lambda y: {
        **y,
        'league': {
            'name': x['name'],
            'lmroster': next(iter([z for z in x['rosters'] if z['owner_id'] == y['user_id'] or
                                   (z['co_owners'] != None and y['user_id'] in z['co_owners'])]), None),
            'roster': next(iter([z for z in x['rosters'] if z['owner_id'] == user['user_id'] or
                                 (z['co_owners'] != None and user['user_id'] in z['co_owners'])]), None)
        }
    }, x['users'])), leagues))

    leaguemates = list(filter(lambda x: x['league']['lmroster'] != None, list(
        itertools.chain(*leaguemates))))

    leaguemates_dict = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=100) as executor:
        list(executor.map(lambda x: {
            leaguemates_dict.append({
                **x,
                'leagues': [y['league'] for i, y in enumerate(leaguemates) if y['user_id'] == x['user_id']]
            })
        }, leaguemates))

    leaguemates_dict = list({
        x['user_id']: x for x in leaguemates_dict
    }.values())
    
    return leaguemates_dict

'''
@app.route('/playershares', methods=['POST'])
def getPlayerShares():
    leagues = request.get_json()['leagues']
    user = request.get_json()['user']
    allplayers = requests.get(
        'https://api.sleeper.app/v1/players/nfl'
    ).json()

    players_all = (
        list(map(lambda x:
            list(map(lambda y:
                [] if y['players'] == None else 
                list(map(lambda z:
                    {
                        'id': z,
                        'name': allplayers[z] if z in allplayers.keys() else z
                    }
                ))
            ))
        ))
    )
    
'''
    

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/<path>')
def catch_all(path):
    return app.send_static_file('index.html')
    