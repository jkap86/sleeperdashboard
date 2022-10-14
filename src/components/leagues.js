import { useState, useEffect, useRef } from "react"
import Search from "./search"

const Leagues = (props) => {
    const [leagues, setLeagues] = useState([])
    const [searched, setSearched] = useState('')

    useEffect(() => {
        setLeagues(props.leagues.map(league => {
            const standings = league.rosters.sort((a, b) =>
                b.settings.wins - a.settings.wins || b.settings.losses - a.settings.losses ||
                b.settings.fpts - a.settings.fpts
            )
            const rank = standings.findIndex(obj => {
                return obj.owner_id === props.user_id
            })
            league['rank'] = rank + 1
            const standings_points = league.rosters.sort((a, b) =>
                b.settings.fpts - a.settings.fpts || b.settings.wins - a.settings.wins
            )
            const rank_points = standings_points.findIndex(obj => {
                return obj.owner_id === props.user_id
            })
            league['rank_points'] = rank_points + 1
            return league
        }))
    }, [props])

    const header = (
        <tr>
            <th colSpan={3}>
                League
            </th>
            <th colSpan={3}>
                Record
            </th>
            <th colSpan={2}>
                PF
            </th>
            <th colSpan={2}>
                PA
            </th>
            <th colSpan={1} className="small">
                Rank (Ovr)
            </th>
            <th colSpan={1} className="small">
                Rank (PF)
            </th>
            <th colSpan={1} className="small">
                Teams
            </th>
        </tr>
    )

    const leagues_display = searched.trim().length === 0 ? leagues :
        leagues.filter(x => x.name.trim() === searched.trim())

    const display = (
        leagues_display.map((league, index) =>
            <tr key={`${league.league_id}_${index}`}>
                <td colSpan={3} className="image">
                    <span>
                        {
                            props.avatar(league.avatar, league.name, 'league')
                        }
                        <strong>
                            {
                                league.name
                            }
                        </strong>
                    </span>
                </td>
                <td colSpan={3}>
                    {
                        `${league.wins}-${league.losses}${league.ties > 0 ? league.ties : ''}`
                    }
                    &nbsp;&nbsp;
                    <em>
                        {
                            (league.wins / (league.wins + league.losses + league.ties)).toLocaleString("en-US", { maximumFractionDigits: 4, minimumFractionDigits: 4 })
                        }
                    </em>
                </td>
                <td colSpan={2}>
                    {
                        league.fpts.toLocaleString("en-US")
                    }
                </td>
                <td colSpan={2}>
                    {
                        league.fpts_against.toLocaleString("en-US")
                    }
                </td>
                <td>
                    {
                        league.rank
                    }
                </td>
                <td>
                    {
                        league.rank_points
                    }
                </td>
                <td>
                    {
                        league.total_rosters
                    }
                </td>
            </tr>
        )
    )


    return <>
        <Search
            list={leagues.map(league => league.name)}
            placeholder={'Search Leagues'}
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

export default Leagues;