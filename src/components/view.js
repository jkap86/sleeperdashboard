import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';
import axiosRetry from "axios-retry";
import Leagues from './leagues';
import user_avatar from '../images/user_avatar.jpeg';
import league_avatar from '../images/league_avatar.png';
import player_avatar from '../images/headshot.png';
import Leaguemates from "./leaguemates";
import PlayerShares from "./playershares";

const View = () => {
    const params = useParams();
    const [tab, setTab] = useState('Leagues');
    const [type1, setType1] = useState('All');
    const [type2, setType2] = useState('All');
    const [isLoadingLeagues, setIsLoadingLeagues] = useState(false);
    const [isLoadingLeaguemates, setIsLoadingLeaguemates] = useState(false);
    const [isLoadingPlayerShares, setIsLoadingPlayerShares] = useState(false);
    const [state_User, setState_User] = useState(false);
    const [stateLeagues, setStateLeagues] = useState([]);
    const [stateLeaguemates, setStateLeaguemates] = useState([]);
    const [statePlayerShares, setStatePlayerShares] = useState([]);

    useEffect(() => {
        const fetchData = async (user) => {
            setIsLoadingLeagues(true)
            const leagues = await axios.get(`/leagues/${user.user_id}`)
            setStateLeagues(leagues.data.leagues)
            setStateLeaguemates(leagues.data.leaguemates)
            console.log(leagues.data.leaguemates)
            setIsLoadingLeagues(false)
            /*
            setIsLoadingLeaguemates(true)
            setIsLoadingPlayerShares(true)
            const [lms, ps] = await Promise.all([
                await axios.post('/leaguemates', {
                    leagues: leagues.data,
                    user: user
                }),
                await axios.post('/playershares', {
                    leagues: leagues.data,
                    user: user
                })
            ])
            setStateLeaguemates(lms.data.sort((a, b) => b.leagues.length - a.leagues.length))
            setStatePlayerShares(ps.data.sort((a, b) => b.leagues_owned.length - a.leagues_owned.length))
            setIsLoadingLeaguemates(false)
            setIsLoadingPlayerShares(false)
            */
        }
        const fetchUser = async () => {
            const user = await axios.get(`/user/${params.username}`)
            if (user.data === 'Invalid') {
                setState_User(false)
            } else {
                setState_User(user.data)
                fetchData(user.data)
            }
        }
        fetchUser()
    }, [params.username])

    const avatar = (avatar_id, alt, type) => {
        let source;
        let onError = null
        switch (type) {
            case 'league':
                source = avatar_id ? `https://sleepercdn.com/avatars/${avatar_id}` : league_avatar
                break;
            case 'user':
                source = avatar_id ? `https://sleepercdn.com/avatars/${avatar_id}` : user_avatar
                break;
            case 'player':
                source = `https://sleepercdn.com/content/nfl/players/thumb/${avatar_id}.jpg`
                onError = (e) => { return e.target.src = player_avatar }
                break;
            default:
                source = avatar_id ? `https://sleepercdn.com/avatars/${avatar_id}` : league_avatar
                break;
        }
        const image = <img
            alt={alt}
            src={source}
            onError={onError}
            className="thumbnail"
        />
        return image
    }
    const totals = (
        isLoadingLeagues ? null :
            <table className="summary">
                <tbody>
                    <tr>
                        <td colSpan={6} className="bold">{stateLeagues?.length} Leagues</td>
                    </tr>
                    <tr>
                        <th>W</th>
                        <th>L</th>
                        <th>T</th>
                        <th>WPCT</th>
                        <th>Pts For</th>
                        <th>Pts Against</th>
                    </tr>
                    <tr>
                        <td>
                            {
                                stateLeagues.reduce((acc, cur) => acc + cur.wins, 0)
                            }
                        </td>
                        <td>
                            {
                                stateLeagues.reduce((acc, cur) => acc + cur.losses, 0)
                            }
                        </td>
                        <td>
                            {
                                stateLeagues.reduce((acc, cur) => acc + cur.ties, 0)
                            }
                        </td>
                        <td>
                            <em>
                                {
                                    (
                                        stateLeagues.reduce((acc, cur) => acc + cur.wins, 0) /
                                        stateLeagues.reduce((acc, cur) => acc + cur.wins + cur.losses + cur.ties, 0)
                                    ).toLocaleString("en-US", {
                                        maximumFractionDigits: 4,
                                        minimumFractionDigits: 4
                                    })
                                }
                            </em>
                        </td>
                        <td>
                            {
                                stateLeagues.reduce((acc, cur) => acc + cur.fpts, 0).toLocaleString("en-US", {
                                    maximumFractionDigits: 2
                                })
                            } pts
                        </td>
                        <td>
                            {
                                stateLeagues.reduce((acc, cur) => acc + cur.fpts_against, 0).toLocaleString("en-US", {
                                    maximumFractionDigits: 2
                                })
                            } pts
                        </td>
                    </tr>
                </tbody>
            </table>
    )
    let display;
    switch (tab) {
        case 'Leagues':
            display = isLoadingLeagues ? <h1>Loading...</h1> :
                <Leagues
                    leagues={stateLeagues}
                    user_id={state_User.user_id}
                    avatar={avatar}
                />
            break;
        case 'Leaguemates':
            display = isLoadingLeaguemates ? <h1>Loading..</h1> :
                <Leaguemates
                    leaguemates={stateLeaguemates}
                    user_id={state_User.user_id}
                    username={state_User.display_name}
                    avatar={avatar}
                />
            break;
        case 'Player Shares':
            display = isLoadingPlayerShares ? <h1>Loading...</h1> :
                <PlayerShares
                    player_shares={statePlayerShares}
                    avatar={avatar}
                />
            break;
        default:
            break;
    }

    return <div id="view">
        <Link to="/" className="home">
            Home
        </Link>
        {
            state_User === 'Invalid' ? <h1 className="error">USERNAME NOT FOUND</h1> :
                !state_User ? <h1>Loading...</h1> :
                    <>
                        <div className="heading">
                            <h1>
                                <p className="image">
                                    <img
                                        alt={state_User.display_name}
                                        src={`https://sleepercdn.com/avatars/${state_User.avatar}`}
                                        className="avatar_heading"
                                    />
                                    <strong>
                                        {state_User.display_name}
                                    </strong>
                                </p>
                            </h1>
                            <div className="navbar">
                                <button
                                    className={tab === 'Leagues' ? 'active' : null}
                                    onClick={() => setTab('Leagues')}>
                                    Leagues
                                </button>
                                <button
                                    className={tab === 'Leaguemates' ? 'active' : null}
                                    onClick={() => setTab('Leaguemates')}>
                                    Leaguemates
                                </button>
                                <button
                                    className={tab === 'Player Shares' ? 'active' : null}
                                    onClick={() => setTab('Player Shares')}>
                                    Player Shares
                                </button>
                                <button
                                    className={tab === 'Trades' ? 'active' : null}
                                    onClick={() => setTab('Trades')}>
                                    Trades
                                </button>
                            </div>
                            <div className="switch_wrapper">
                                <div className="switch">
                                    <button className={type1 === 'Redraft' ? 'active' : null} onClick={() => setType1('Redraft')}>Redraft</button>
                                    <button className={type1 === 'All' ? 'active' : null} onClick={() => setType1('All')}>All</button>
                                    <button className={type1 === 'Dynasty' ? 'active' : null} onClick={() => setType1('Dynasty')}>Dynasty</button>
                                </div>
                                <div className="switch">
                                    <button className={type2 === 'Bestball' ? 'active' : null} onClick={() => setType2('Bestball')}>Bestball</button>
                                    <button className={type2 === 'All' ? 'active' : null} onClick={() => setType2('All')}>All</button>
                                    <button className={type2 === 'Standard' ? 'active' : null} onClick={() => setType2('Standard')}>Standard</button>
                                </div>
                            </div>
                            <div className="summary">
                                {totals}
                            </div>
                        </div>
                        {display}
                    </>
        }



    </div>
}

export default View