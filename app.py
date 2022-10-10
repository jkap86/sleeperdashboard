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

@app.route('/leagues/<user_id>')
def getLeagues(user_id):
    leagues = requests.get('https://api.sleeper.app/v1/user/' + user_id + '/leagues/nfl/2022').json()
    return leagues

@app.route('/leaguesdetailed', methods=['POST'])
def getLeaguesDetailed():
    data = request.get_json()
    user = data['user']
    leagues = data['leagues']
    def getLeagueInfo(league):
            users = requests.get(
                'https://api.sleeper.app/v1/league/' + league['league_id'] + '/users').json()
            rosters = requests.get(
                'https://api.sleeper.app/v1/league/' + league['league_id'] + '/rosters').json()
            league['users'] = users
            league['rosters'] = rosters
            roster = next(
                x for x in rosters if x['owner_id'] == user['user_id'] or (x['co_owners'] != None and user['user_id'] in x['co_owners']))
            league['wins'] = roster['settings']['wins']
            league['losses'] = roster['settings']['losses']
            league['ties'] = roster['settings']['ties']
            league['fpts'] = float(
                str(roster['settings']['fpts']))
            league['fpts_against'] = float(str(
                roster['settings']['fpts_against']) + "." + str(roster['settings']['fpts_against_decimal'])) if 'fpts_against' in roster['settings'].keys() else 0
            league['dynasty'] = 'Dynasty' if league['settings']['type'] == 2 else 'Redraft'
            league['bestball'] = 'Bestball' if ('best_ball' in league['settings'].keys(
            ) and league['settings']['best_ball'] == 1) else 'Standard'

            return league

    with concurrent.futures.ThreadPoolExecutor(max_workers=100) as executor:
        leagues_detailed = list(executor.map(getLeagueInfo, leagues))
        return leagues_detailed
    
@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/<path>')
def catch_all(path):
    return app.send_static_file('index.html')