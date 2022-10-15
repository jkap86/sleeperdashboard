import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
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
    const isInitialRender = useRef(true);
    const [tab, setTab] = useState('Leagues');
    const [type1, setType1] = useState('All');
    const [type2, setType2] = useState('All');
    const [isLoadingLeagues, setIsLoadingLeagues] = useState(false);
    const [isLoadingLeaguemates, setIsLoadingLeaguemates] = useState(false);
    const [isLoadingPlayerShares, setIsLoadingPlayerShares] = useState(false);
    const [state_User, setState_User] = useState(false);
    const [stateLeagues, setStateLeagues] = useState({
        original: [],
        display: []
    });
    const [stateLeaguemates, setStateLeaguemates] = useState({
        original: [],
        display: []
    });
    const [statePlayerShares, setStatePlayerShares] = useState({
        original: [],
        display: []
    });

    useEffect(() => {
        const fetchData = async (user) => {
            setIsLoadingLeagues(true)
            setIsLoadingLeaguemates(true)
            setIsLoadingPlayerShares(true)

            const leagues = await axios.get(`/leagues/${user.user_id}`)
            setStateLeagues({
                original: leagues.data.leagues,
                display: leagues.data.leagues
            })
            const leaguemates = await axios.get(`/leaguemates/${user.user_id}`)
            setStateLeaguemates({
                original: leaguemates.data.leaguemates,
                display: leaguemates.data.leaguemates
            })
            const playershares = await axios.get(`/playershares/${user.user_id}`)
            setStatePlayerShares({
                original: playershares.data.playershares,
                display: playershares.data.playershares
            })
            console.log(leaguemates.data)
            setIsLoadingLeagues(false)
            setIsLoadingLeaguemates(false)
            setIsLoadingPlayerShares(false)
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

    useEffect(() => {
        const fetchFiltered = async () => {
            const leagues = stateLeagues.original
            const leaguemates = stateLeaguemates.original
            const playershares = statePlayerShares.original
            let filteredLeagues;
            let filteredLeaguemates;
            let filteredPlayerShares;
            switch (type1) {
                case ('Redraft'):
                    filteredLeagues = leagues.filter(x => x.dynasty === 'Redraft')
                    filteredLeaguemates = leaguemates.map(lm => {
                        return {
                            ...lm,
                            leagues: lm.leagues.filter(x => x.dynasty === 'Redraft')
                        }
                    })
                    filteredPlayerShares = playershares.map(player => {
                        return {
                            ...player,
                            leagues_owned: player.leagues_owned.filter(x => x.dynasty === 'Redraft')
                        }
                    })
                    break;
                case ('All'):
                    filteredLeagues = leagues
                    filteredLeaguemates = leaguemates.map(lm => {
                        return {
                            ...lm,
                            leagues: lm.leagues
                        }
                    })
                    filteredPlayerShares = playershares.map(player => {
                        return {
                            ...player,
                            leagues_owned: player.leagues_owned
                        }
                    })
                    break;
                case ('Dynasty'):
                    filteredLeagues = leagues.filter(x => x.dynasty === 'Dynasty')
                    filteredLeaguemates = leaguemates.map(lm => {
                        return {
                            ...lm,
                            leagues: lm.leagues.filter(x => x.dynasty === 'Dynasty')
                        }
                    })
                    filteredPlayerShares = playershares.map(player => {
                        return {
                            ...player,
                            leagues_owned: player.leagues_owned.filter(x => x.dynasty === 'Dynasty')
                        }
                    })
                    break;
                default:
                    filteredLeagues = leagues
                    filteredLeaguemates = leaguemates.map(lm => {
                        return {
                            ...lm,
                            leagues: lm.leagues
                        }
                    })
                    break;
            }
            switch (type2) {
                case ('Bestball'):
                    filteredLeagues = filteredLeagues.filter(x => x.bestball === 'Bestball')
                    filteredLeaguemates = filteredLeaguemates.map(lm => {
                        return {
                            ...lm,
                            leagues: lm.leagues.filter(x => x.bestball === 'Bestball')
                        }
                    })
                    filteredPlayerShares = filteredPlayerShares.map(player => {
                        return {
                            ...player,
                            leagues_owned: player.leagues_owned.filter(x => x.bestball === 'Bestball')
                        }
                    })
                    break;
                case ('All'):
                    filteredLeagues = filteredLeagues
                    filteredLeaguemates = filteredLeaguemates.map(lm => {
                        return {
                            ...lm,
                            leagues: lm.leagues
                        }
                    })
                    filteredPlayerShares = filteredPlayerShares.map(player => {
                        return {
                            ...player,
                            leagues_owned: player.leagues_owned
                        }
                    })
                    break;
                case ('Standard'):
                    filteredLeagues = filteredLeagues.filter(x => x.bestball === 'Standard')
                    filteredLeaguemates = filteredLeaguemates.map(lm => {
                        return {
                            ...lm,
                            leagues: lm.leagues.filter(x => x.bestball === 'Standard')
                        }
                    })
                    filteredPlayerShares = filteredPlayerShares.map(player => {
                        return {
                            ...player,
                            leagues_owned: player.leagues_owned.filter(x => x.bestball === 'Standard')
                        }
                    })
                    break;
                default:
                    filteredLeagues = filteredLeagues
                    filteredLeaguemates = filteredLeaguemates.map(lm => {
                        return {
                            ...lm,
                            leagues: lm.leagues
                        }
                    })
                    filteredPlayerShares = filteredPlayerShares.map(player => {
                        return {
                            ...player,
                            leagues_owned: player.leagues_owned
                        }
                    })
                    break;
            }

            setStateLeagues({
                ...stateLeagues,
                display: [...filteredLeagues]
            })
            setStateLeaguemates({
                ...stateLeaguemates,
                display: [...filteredLeaguemates]
            })
            setStatePlayerShares({
                ...statePlayerShares,
                display: [...filteredPlayerShares]
            })

        }
        if (isInitialRender.current) {
            isInitialRender.current = false
        } else {
            fetchFiltered()
        }
    }, [type1, type2])

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
                        <td colSpan={6} className="bold">{stateLeagues.display.length} Leagues</td>
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
                                stateLeagues.display.reduce((acc, cur) => acc + cur.wins, 0)
                            }
                        </td>
                        <td>
                            {
                                stateLeagues.display.reduce((acc, cur) => acc + cur.losses, 0)
                            }
                        </td>
                        <td>
                            {
                                stateLeagues.display.reduce((acc, cur) => acc + cur.ties, 0)
                            }
                        </td>
                        <td>
                            <em>
                                {
                                    (
                                        stateLeagues.display.reduce((acc, cur) => acc + cur.wins, 0) /
                                        stateLeagues.display.reduce((acc, cur) => acc + cur.wins + cur.losses + cur.ties, 0)
                                    ).toLocaleString("en-US", {
                                        maximumFractionDigits: 4,
                                        minimumFractionDigits: 4
                                    })
                                }
                            </em>
                        </td>
                        <td>
                            {
                                stateLeagues.display.reduce((acc, cur) => acc + cur.fpts, 0).toLocaleString("en-US", {
                                    maximumFractionDigits: 2
                                })
                            } pts
                        </td>
                        <td>
                            {
                                stateLeagues.display.reduce((acc, cur) => acc + cur.fpts_against, 0).toLocaleString("en-US", {
                                    maximumFractionDigits: 2
                                })
                            } pts
                        </td>
                    </tr>
                </tbody>
            </table>
    )

    let display = (
        <div>
            <div hidden={tab !== 'Leagues'}>
                <Leagues
                    leagues={stateLeagues.display}
                    user_id={state_User.user_id}
                    avatar={avatar}
                />
            </div>
            <div hidden={tab !== 'Leaguemates'}>
                <Leaguemates
                    leaguemates={stateLeaguemates.display}
                    user_id={state_User.user_id}
                    username={state_User.display_name}
                    avatar={avatar}
                />
            </div>
            <div hidden={tab !== 'Player Shares'}>
                <PlayerShares
                    player_shares={statePlayerShares.display}
                    avatar={avatar}
                />
            </div>
        </div>
    )

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