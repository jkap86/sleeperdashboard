from flask import Flask, request, session
from flask_session import Session
import requests
import concurrent.futures
import itertools
import functools

app = Flask(__name__, static_folder='build/', static_url_path='/')
app.debug = True
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
app.secret_key = '1111'

@app.route('/user/<username>')
def getUser(username):
    user = requests.get(
        'https://api.sleeper.app/v1/user/' + str(username)
    ).json()
    if (user == None):
        user = 'Invalid'

    return user

@app.route('/leagues/<user_id>', methods=['GET', 'POST'])
def getLeagues(user_id):
    leagues = requests.get('https://api.sleeper.app/v1/user/' + user_id + '/leagues/nfl/2022').json()
    
    def getLeagueInfo(league):
            users = requests.get(
                'https://api.sleeper.app/v1/league/' + league['league_id'] + '/users').json()
            rosters = requests.get(
                'https://api.sleeper.app/v1/league/' + league['league_id'] + '/rosters').json()
            league['users'] = users
            league['rosters'] = rosters
            league['dynasty'] = 'Dynasty' if league['settings']['type'] == 2 else 'Redraft'
            league['bestball'] = 'Bestball' if ('best_ball' in league['settings'].keys(
            ) and league['settings']['best_ball'] == 1) else 'Standard'

            roster = next(iter([
                x for x in rosters if x['owner_id'] == user_id or (x['co_owners'] != None and user_id in x['co_owners'])]), None)
            
            league['userRoster'] = roster
            return league
          

    with concurrent.futures.ThreadPoolExecutor(max_workers=100) as executor:
        leagues_detailed = list(executor.map(getLeagueInfo, leagues))
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


@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/<path>')
def catch_all(path):
    return app.send_static_file('index.html')