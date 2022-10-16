import React, { useState, useEffect } from "react";
import LeaguemateLeagues from "./leaguemateLeagues";
import Search from "./search";

const Leaguemates = (props) => {
    const [leaguemates, setLeaguemates] = useState([])
    const [searched, setSearched] = useState('')
    const [page, setPage] = useState(1)
    const [leaguesVisible, setLeaguesVisible] = useState([])

    const toggleLeagues = (leaguemate_id) => {
        let lv = leaguesVisible;
        if (lv.includes(leaguemate_id)) {
            lv = lv.filter(x => x !== leaguemate_id)
            console.log(lv)
        } else {
            lv.push(leaguemate_id)
        }
        setLeaguesVisible([...lv])
    }

    useEffect(() => {
        setLeaguemates(props.leaguemates.sort((a, b) => b.leagues.length - a.leagues.length))
    }, [props])

    useEffect(() => {
        setPage(1)
    }, [searched, props.leaguemates])

    const header = (
        <>
            <tr className="main_header_double">
                <th rowSpan={2}>Leaguemate</th>
                <th rowSpan={2}>Leagues</th>
                <th colSpan={2}>Leaguemate</th>
                <th colSpan={2}>{props.username}</th>
            </tr>
            <tr className="main_header_double">
                <th>Record</th>
                <th>WinPCT</th>
                <th>Record</th>
                <th>WinPCT</th>
            </tr>
        </>
    )

    const leaguemates_display = searched.trim().length === 0 ? leaguemates.filter(x => x.user_id !== props.user_id) :
        leaguemates.filter(x => x.display_name.trim() === searched.trim())

    const display = (
        leaguemates_display.slice((page - 1) * 50, ((page - 1) * 50) + 50).map((leaguemate, index) =>
            <tr
                key={`${leaguemate.user_id}_${index}`}
                className={leaguesVisible.includes(leaguemate.user_id) ? 'active' : 'main_row'}>
                <td colSpan={6}>
                    <table className="content">
                        <tbody>
                            <tr onClick={() => toggleLeagues(leaguemate.user_id)}>
                                <td className="image">
                                    <span className="image">
                                        {
                                            props.avatar(leaguemate.avatar, leaguemate.display_name, 'user')
                                        }
                                        <strong>
                                            {
                                                leaguemate.display_name
                                            }
                                        </strong>
                                    </span>
                                </td>
                                <td>
                                    {
                                        leaguemate.leagues.length
                                    }
                                </td>
                                <td>
                                    {
                                        leaguemate.leagues.reduce((acc, cur) => acc + cur.lmroster?.settings.wins, 0)
                                    }
                                    -
                                    {
                                        leaguemate.leagues.reduce((acc, cur) => acc + cur.lmroster?.settings.losses, 0)
                                    }
                                </td>
                                <td>
                                    <em>
                                        {
                                            (leaguemate.leagues.reduce((acc, cur) => acc + cur.lmroster?.settings.wins, 0) /
                                                leaguemate.leagues.reduce((acc, cur) => acc + cur.lmroster?.settings.wins + cur.lmroster?.settings.losses, 0)).toLocaleString("en-US", { maximumFractionDigits: 4, minimumFractionDigits: 4 })
                                        }
                                    </em>
                                </td>
                                <td>
                                    {
                                        leaguemate.leagues.reduce((acc, cur) => acc + cur.roster.settings.wins, 0)
                                    }
                                    -
                                    {
                                        leaguemate.leagues.reduce((acc, cur) => acc + cur.roster.settings.losses, 0)
                                    }
                                </td>
                                <td>
                                    <em>
                                        {
                                            (leaguemate.leagues.reduce((acc, cur) => acc + cur.roster.settings.wins, 0) /
                                                leaguemate.leagues.reduce((acc, cur) => acc + cur.roster.settings.wins + cur.roster.settings.losses, 0)).toLocaleString("en-US", { maximumFractionDigits: 4, minimumFractionDigits: 4 })
                                        }
                                    </em>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div hidden={!leaguesVisible.includes(leaguemate.user_id)}>
                        <LeaguemateLeagues
                            leagues={leaguemate.leagues}
                            leaguemate={leaguemate.display_name}
                            username={props.username}
                            avatar={props.avatar}
                        />
                    </div>
                </td>
            </tr>
        )
    )
    return <>
        <Search
            list={leaguemates.map(leaguemate => leaguemate.display_name)}
            placeholder={'Search Leaguemates'}
            sendSearched={(data) => setSearched(data)}
        />
        <ol className="page_numbers">
            {Array.from(Array(Math.ceil(leaguemates_display.length / 50)).keys()).map(key => key + 1).map(page_number =>
                <li className={page === page_number ? 'active clickable' : 'clickable'} key={page_number} onClick={() => setPage(page_number)}>
                    {page_number}
                </li>
            )}
        </ol>
        <div className="scrollable">
            <table className="main">
                <tbody>
                    {header}
                    {display}
                </tbody>
            </table>
        </div>
    </>
}

export default Leaguemates;