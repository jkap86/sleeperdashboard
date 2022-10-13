import { useState, useEffect } from "react"
import Search from "./search"

const Leagues = (props) => {
    const [leagues, setLeagues] = useState([])

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

    const searchLeagues = (league_name) => {
        let l = leagues
        if (league_name !== undefined && league_name.trim().length > 0) {
            l.map(league => {
                return league.isLeagueHidden = true
            })
            l.filter(x => x.name.trim() === league_name.trim()).map(league => {
                return league.isLeagueHidden = false
            })
        } else {
            l.map(league => {
                return league.isLeagueHidden = false
            })
        }
        setLeagues([...l])
    }

    const header = (
        <tr className="main_header">
            <th colSpan={3}>
                League
            </th>
            <th colSpan={2}>
                Record
            </th>
            <th colSpan={2}>
                PF - PA
            </th>
            <th>
                Rank
            </th>
            <th>
                Rank (PF)
            </th>
            <th>
                Teams
            </th>
        </tr>
    )

    const display = leagues.filter(x => x.isLeagueHidden === undefined || x.isLeagueHidden === false).map((league, index) =>
        <tr key={`${league.league_id}_${index}`}>
            <td colSpan={3}>
                <span className="image">
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
            <td colSpan={2}>
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
                <p>
                    PF: {
                        league.fpts.toLocaleString("en-US")
                    }
                </p>
                <p>
                    PA: {
                        league.fpts_against.toLocaleString("en-US")
                    }
                </p>
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



    return <>
        <Search
            list={leagues.map(league => league.name)}
            placeholder={'Search Leagues'}
            sendSearched={(data) => searchLeagues(data)}
        />
        <div className="scrollable">
            <table className="main leagues">
                <tbody>
                    {header}
                    {display}
                </tbody>
            </table>
        </div>
    </>
}

export default Leagues;