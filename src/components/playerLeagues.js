import { useEffect, useState } from "react";

const PlayerLeagues = (props) => {
    const [leaguesOwned, setLeaguesOwned] = useState([])


    useEffect(() => {
        setLeaguesOwned(props.leagues_owned)
        console.log(props.leagues_owned)
    }, [props.leagues_owned])

    let display = (
        <tbody>
            {
                leaguesOwned.map((league, index) =>
                    <tr key={`${league.league_id}_${index}`}>
                        <td colSpan={3} className="image">
                            <span className="image">
                                {
                                    props.avatar(league.league_avatar, league.league_name, 'league')
                                }
                                <strong>
                                    {league.league_name}
                                </strong>
                            </span>
                        </td>
                        <td colSpan={2}>{league.status}</td>
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
                        <td colSpan={3}></td>
                    </tr>
                )
            }
        </tbody>
    )

    return <>
        <table className="secondary">
            <tbody>
                <tr>
                    <th colSpan={3}>League</th>
                    <th colSpan={2}>Status</th>
                    <th colSpan={3}>Record</th>
                    <th colSpan={2}>PF</th>
                    <th colSpan={2}>PA</th>
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
            </tbody>
            {display}
        </table>
    </>
}

export default PlayerLeagues;