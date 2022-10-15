from flask import Flask, request, session
from flask_session import Session
from flask_compress import Compress
import requests
import concurrent.futures
import itertools
import functools

app = Flask(__name__, static_folder='build/', static_url_path='/')
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
app.secret_key = '1111'
Compress(app)

def getLeagueInfo(league, user_id):
    users = requests.get(
        'https://api.sleeper.app/v1/league/' + str(league['league_id']) + '/users', timeout=3).json()
          
    rosters = requests.get(
        'https://api.sleeper.app/v1/league/' + str(league['league_id']) + '/rosters', timeout=3).json()
        
    userRoster = next(iter([x for x in rosters if x['owner_id'] == user_id or 
        (x['co_owners'] != None and user_id in x['co_owners'])]), None)
    league = {
            'league_id': league['league_id'],
            'name': league['name'],
            'avatar': league['avatar'],
            'total_rosters': league['total_rosters'],
            'wins': userRoster['settings']['wins'] if userRoster != None else 0,
            'losses': userRoster['settings']['losses'] if userRoster != None else 0,
            'ties': userRoster['settings']['ties'] if userRoster != None else 0,
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
            'userRoster': userRoster,
            'dynasty': 'Dynasty' if league['settings']['type'] == 2 else 'Redraft',
            'bestball': 'Bestball' if ('best_ball' in league['settings'].keys(
                ) and league['settings']['best_ball'] == 1) else 'Standard',
            'isHidden': False
        }
    return league
          
def getLeaguemates_League(league, user_id):
    userRoster = (
        next(iter([z for z in league['rosters'] if z['owner_id'] == user_id or
            (z['co_owners'] != None and user_id in z['co_owners'])]), None)
    )
    leaguemates_league = []
    for lm in league['users']:
        lmroster = (
            next(iter([z for z in league['rosters'] if z['owner_id'] == lm['user_id'] or
            (z['co_owners'] != None and lm['user_id'] in z['co_owners'])]), None)
        )

        if lmroster != None and userRoster != None:
            leaguemates_league.append({
                **lm,
                'league': {
                    **league,
                    'lmroster': lmroster,
                    'roster': userRoster
                }
            })
    
    return leaguemates_league

def addLmLeagues(leaguemate, leaguemates_all):
    return({
        **leaguemate,
        'leagues': [y['league'] for i, y in enumerate(leaguemates_all) if y['user_id'] == leaguemate['user_id']]
    })
        
def getLM(leagues, user_id):
    leaguemates = list(map(getLeaguemates_League, leagues, itertools.repeat(user_id)))
    leaguemates = list(itertools.chain(*leaguemates))
    leaguemates_dict = list(map(addLmLeagues, leaguemates, itertools.repeat(leaguemates)))
    leaguemates_dict = list({
        lm['user_id']: lm for lm in leaguemates_dict
    }.values())
    return leaguemates_dict

def getPlayersLeague(league, allplayers):
    standings = sorted(league['rosters'], key=lambda x: (x['settings']['wins'], x['settings']['fpts']), reverse=True)
    pointsList = sorted(league['rosters'], key=lambda x: x['settings']['fpts'], reverse=True)

    return [[{
        'id': z,
        'player': allplayers.get(z, {'full_name': 'INACTIVE'}),
        'status': 'Starter' if z in y['starters'] else 
            'Taxi' if z in (y['taxi'] or []) else 
                'IR' if z in (y['reserve'] or []) else
                    'Bench',
        'league_id': league['league_id'],
        'league_name': league['name'],
        'league_avatar': league['avatar'],
        'total_rosters': league['total_rosters'],
        'dynasty': league['dynasty'],
        'bestball': league['bestball'],
        'manager': next(iter([
            m for m in league['users'] if 
                (m['user_id'] == y['owner_id'] or (y['co_owners'] != None and m['user_id'] in y['co_owners']))
            ]), {'display_name': 'Orphan', 'user_id': 0}),
        'rank': next(iter([i + 1 for (i, x) in enumerate(standings) if x['owner_id'] == y['owner_id']]), 0),
        'rank_pts': next(iter([i + 1 for (i, x) in enumerate(pointsList) if x['owner_id'] == y['owner_id']]), 0), 
        'wins': y['settings']['wins'],
        'losses': y['settings']['losses'],
        'ties': y['settings']['ties'],
        'fpts': (
            float(str(y['settings']['fpts']) + "." + str(y['settings']['fpts_decimal'])) 
                if 'fpts_decimal' in y['settings'].keys() else 0
        ),
        'fpts_against': (
            float(str(y['settings']['fpts_against']) + "." + str(y['settings']['fpts_against_decimal']))
                if 'fpts_against_decimal' in y['settings'].keys() else 0
        ) 
    } for z in y['players'] or []] for y in league['rosters'] or []]

def addPlayerLeagues(player, user_id, players_all):
    player_detail = {
        **player,
        'leagues_owned': [
            x for x in players_all if x['id'] == player['id'] and x['manager']['user_id'] == user_id
        ],
        'leagues_taken': [
            x for x in players_all if x['id'] == player['id'] and x['manager']['user_id'] != user_id
        ]
    }
    return player_detail

def getPlayerShares(leagues, user_id, allplayers):
    with concurrent.futures.ThreadPoolExecutor(max_workers=1000) as executor:
        players_all = list(executor.map(getPlayersLeague, leagues, itertools.repeat(allplayers)))
        players_all = list(itertools.chain(*list(itertools.chain(*players_all))))
        players_unique = list({
            player['id']: {
                'id': player['id'],
                'player': player['player']
            } for player in players_all
        }.values())
        playershares = list(executor.map(addPlayerLeagues, players_unique, itertools.repeat(user_id), itertools.repeat(players_all)))
        
    return playershares
    

@app.route('/user/<username>')
def getUser(username):
    user = requests.get(
        'https://api.sleeper.app/v1/user/' + str(username), timeout=3
    ).json()
    if (user == None):
        user = 'Invalid'

    return user

@app.route('/leagues/<user_id>', methods=['GET', 'POST'])
@functools.lru_cache(maxsize=128)
def getLeagues(user_id):
    leagues = requests.get('https://api.sleeper.app/v1/user/' + str(user_id) + '/leagues/nfl/2022', timeout=3).json()
    
    with concurrent.futures.ProcessPoolExecutor(max_workers=10) as executor:
        leagues_detailed = list(executor.map(getLeagueInfo, leagues, itertools.repeat(user_id)))
    
    session[user_id] = {
        'leagues': leagues_detailed
    }

    return {
        'leagues': leagues_detailed
    }


@app.route('/leaguemates/<user_id>')
@functools.lru_cache(maxsize=128)
def getLeaguemates(user_id):
    leagues = session.get(user_id)

    with concurrent.futures.ProcessPoolExecutor(max_workers=10) as executor:
        leaguemates = list(executor.map(getLM, [leagues['leagues']], [user_id]))
    
    return {
        'leaguemates': leaguemates[0]
    }

@app.route('/playershares/<user_id>')
@functools.lru_cache(maxsize=128)
def getPlayershares(user_id):
    
    if session.get('allplayers') == None:
        print('getting players...')
        allplayers = requests.get(
            'https://api.sleeper.app/v1/players/nfl'
        ).json()
        session['allplayers'] = allplayers
    else:
        print('players already loaded...')
        allplayers = session.get('allplayers')

    user = session.get(user_id)

    with concurrent.futures.ProcessPoolExecutor(max_workers=10) as executor:
        playershares = list(executor.map(getPlayerShares, [user['leagues']], [user_id], [allplayers]))

    return {
        'playershares': playershares[0]
    }

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/<path>')
def catch_all(path):
    return app.send_static_file('index.html')
    