import React, { useState, useEffect } from "react";
import LeaguemateLeagues from "./leaguemateLeagues";
import Search from "./search";

const Leaguemates = (props) => {
    const [leaguemates, setLeaguemates] = useState([])
    const [searched, setSearched] = useState('')

    const showLeagues = (leaguemate_userid) => {
        console.log(leaguemate_userid)
        let lms = leaguemates
        lms.filter(x => x.user_id === leaguemate_userid).map(lm => {
            return lm.isLeaguesHidden = lm.isLeaguesHidden === undefined ? false : !lm.isLeaguesHidden
        })
        setLeaguemates([...lms])
    }

    useEffect(() => {
        setLeaguemates(props.leaguemates.sort((a, b) => b.leagues.length - a.leagues.length))
    }, [props])

    const header = (
        <>
            <tr>
                <th rowSpan={2}>Leaguemate</th>
                <th rowSpan={2}>Leagues</th>
                <th colSpan={2}>Leaguemate</th>
                <th colSpan={2}>{props.username}</th>
            </tr>
            <tr>
                <th>Record</th>
                <th>WinPCT</th>
                <th>Record</th>
                <th>WinPCT</th>
            </tr>
        </>
    )

    const leaguemates_display = searched.trim().length === 0 ? leaguemates :
        leaguemates.filter(x => x.display_name.trim() === searched.trim())

    const display = (
        leaguemates_display.filter(x => x.user_id !== props.user_id).map((leaguemate, index) =>
            <tr
                key={`${leaguemate.user_id}_${index}`}
                onClick={() => showLeagues(leaguemate.user_id)}
            >
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
                        leaguemate.leagues.reduce((acc, cur) => acc + cur.lmroster.settings.wins, 0)
                    }
                    -
                    {
                        leaguemate.leagues.reduce((acc, cur) => acc + cur.lmroster.settings.losses, 0)
                    }
                </td>
                <td>
                    <em>
                        {
                            (leaguemate.leagues.reduce((acc, cur) => acc + cur.lmroster.settings.wins, 0) /
                                leaguemate.leagues.reduce((acc, cur) => acc + cur.lmroster.settings.wins + cur.lmroster.settings.losses, 0)).toLocaleString("en-US", { maximumFractionDigits: 4, minimumFractionDigits: 4 })
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
        )
    )
    return <>
        <Search
            list={leaguemates.map(leaguemate => leaguemate.display_name)}
            placeholder={'Search Leaguemates'}
            sendSearched={(data) => setSearched(data)}
        />
        <div className="scrollable">
            <table className="main">
                <tbody className="main_header">
                    {header}
                </tbody>
                <tbody className="main">
                    {display}
                </tbody>
            </table>
        </div>
    </>
}

export default Leaguemates;