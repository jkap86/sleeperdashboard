import React, { useState, useEffect, useRef } from "react"
import PlayerLeagues from "./playerLeagues"
import Search from "./search"

const PlayerShares = (props) => {
    const [playershares, setPlayershares] = useState([])
    const [starters, setStarters] = useState([])
    const [searched, setSearched] = useState('')
    const [leaguesVisible, setLeaguesVisible] = useState([])
    const [tab, setTab] = useState('All')
    const [page, setPage] = useState(1)

    const toggleLeagues = (player_id) => {
        let lv = leaguesVisible;
        if (lv.includes(player_id)) {
            lv = lv.filter(x => x !== player_id)
            console.log(lv)
        } else {
            lv.push(player_id)
            console.log(lv)
        }
        setLeaguesVisible([...lv])
    }

    useEffect(() => {
        setPlayershares(props.player_shares.sort((a, b) => b.leagues_owned.length - a.leagues_owned.length))
        setStarters(props.player_shares.map(player => {
            return {
                ...player,
                leagues_owned: player.leagues_owned.filter(x => x.status === 'Starter')
            }
        }).sort((a, b) => b.leagues_owned.length - a.leagues_owned.length))
    }, [props])

    useEffect(() => {
        setPage(1)
    }, [searched, props.player_shares])

    const header = (
        <tr className="main_header">
            <th colSpan={3}>
                Name
            </th>
            <th colSpan={1}>
                #
            </th>
            <th>
                W
            </th>
            <th>
                L
            </th>
            <th colSpan={2}>
                W%
            </th>
            <th colSpan={3}>
                PF
            </th>
            <th colSpan={3}>
                PA
            </th>
            <th colSpan={2}>
                <em>
                    Avg Diff
                </em>
            </th>
        </tr>
    )

    let players = tab === 'All' ? playershares : starters

    const playershares_display = searched.trim().length === 0 ? players :
        players.filter(x => x.player.full_name?.trim() === searched.trim())

    const display = (
        <table className="main">
            <tbody>
                {header}
                {playershares_display.slice((page - 1) * 50, ((page - 1) * 50) + 50).map((player, index) =>
                    <React.Fragment key={`${player.id}_${index}`}>
                        <tr
                            className={leaguesVisible.includes(player.id) ? 'active' : 'main_row'}>
                            <td colSpan={16}>
                                <table className="content">
                                    <tbody>
                                        <tr onClick={() => toggleLeagues(player.id)}>
                                            <td colSpan={3} className="image">
                                                <span className="image">
                                                    {
                                                        props.avatar(player.id, player.player.full_name, 'player')
                                                    }
                                                    <strong>
                                                        {
                                                            player.player.full_name
                                                        }
                                                    </strong>
                                                </span>
                                            </td>
                                            <td colSpan={1}>
                                                {
                                                    player.leagues_owned.length
                                                }
                                            </td>
                                            <td>
                                                {
                                                    player.leagues_owned.reduce((acc, cur) => acc + cur.wins, 0)
                                                }
                                            </td>
                                            <td>
                                                {
                                                    player.leagues_owned.reduce((acc, cur) => acc + cur.losses, 0)
                                                }
                                            </td>
                                            <td colSpan={2}>
                                                <em>
                                                    {
                                                        (player.leagues_owned.reduce((acc, cur) => acc + cur.wins, 0) /
                                                            player.leagues_owned.reduce((acc, cur) => acc + cur.losses + cur.wins, 0)).toLocaleString("en-US", { maximumFractionDigits: 4, minimumFractionDigits: 4 })
                                                    }
                                                </em>
                                            </td>
                                            <td colSpan={3}>
                                                {
                                                    player.leagues_owned.reduce((acc, cur) => acc + cur.fpts, 0).toLocaleString("en-US")
                                                }
                                            </td>
                                            <td colSpan={3}>
                                                {
                                                    player.leagues_owned.reduce((acc, cur) => acc + cur.fpts_against, 0).toLocaleString("en-US")
                                                }
                                            </td>
                                            <td colSpan={2}>
                                                <em>
                                                    {
                                                        (
                                                            (player.leagues_owned.reduce((acc, cur) => acc + cur.fpts, 0) -
                                                                player.leagues_owned.reduce((acc, cur) => acc + cur.fpts_against, 0)) / player.leagues_owned.length
                                                        ).toLocaleString("en-US", { maximumFractionDigits: 2 })
                                                    }
                                                </em>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div hidden={!leaguesVisible.includes(player.id)}>
                                    <PlayerLeagues
                                        leagues_owned={player.leagues_owned}
                                        avatar={props.avatar}
                                    />
                                </div>

                            </td>
                        </tr>
                    </React.Fragment>
                )}
            </tbody>
        </table>
    )

    return <>
        <button onClick={() => setTab('All')} className={tab === 'All' ? 'active_toggle_starters' : 'toggle_starters'}>All</button>
        <button onClick={() => setTab('Starters')} className={tab === 'Starters' ? 'active_toggle_starters' : 'toggle_starters'}>Starters</button>
        <Search
            list={playershares.map(player => player.player.full_name)}
            placeholder={'Search Players'}
            sendSearched={(data) => setSearched(data)}
        />
        <ol className="page_numbers">
            {Array.from(Array(Math.ceil(playershares_display.length / 50)).keys()).map(key => key + 1).map(page_number =>
                <li className={page === page_number ? 'active clickable' : 'clickable'} key={page_number} onClick={() => setPage(page_number)}>
                    {page_number}
                </li>
            )}
        </ol>
        <div className="scrollable">

            {display}

        </div>
    </>
}

export default PlayerShares;