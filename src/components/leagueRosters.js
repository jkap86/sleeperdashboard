import { useState, useEffect } from "react";
import LeagueSummary from "./leagueSummary";
import Roster from "./roster";

const LeagueRosters = (props) => {
    const [rosters, setRosters] = useState([]);
    const [activeRoster, setActiveRoster] = useState(0);
    console.log(rosters)
    useEffect(() => {
        setRosters(props.rosters.sort((a, b) =>
            b.settings.wins - a.settings.wins || b.settings.losses - a.settings.losses ||
            b.settings.fpts - a.settings.fpts
        ))
        setActiveRoster(props.rosters.find(x => x.owner_id === props.user_id))
    }, [props])

    const display = (
        rosters.map((roster, index) =>
            <tr key={`${roster.roster_id}_${index}`} onClick={() => setActiveRoster(roster)}>
                <td colSpan={2} className="image_secondary">
                    <span className="image">
                        {
                            props.avatar(
                                props.users.find(x => x.user_id === roster.owner_id)?.avatar,
                                props.users.find(x => x.user_id === roster.owner_id)?.display_name,
                                'user'
                            )
                        }
                        <strong>
                            {props.users.find(x => x.user_id === roster.owner_id)?.display_name}
                        </strong>
                    </span>
                </td>
                <td>
                    {`${roster.settings.wins}-${roster.settings.losses}${roster.settings.ties > 0 ? roster.settings.ties : ''}`}
                </td>
                <td>
                    {
                        `${roster.settings.fpts}.${roster.settings?.fpts_decimal}`
                    }
                </td>
                <td>
                    {
                        `${roster.settings?.fpts_against}.${roster.settings?.fpts_against_decimal}`
                    }
                </td>
                {index > 0 ? null :
                    <td rowSpan={rosters.length} colSpan={5} className="league_summary">
                        {
                            activeRoster !== 0 ?
                                <Roster
                                    user={props.users.find(x => x.user_id === activeRoster.owner_id)}
                                    activeRoster={activeRoster}
                                    roster_positions={props.roster_positions}
                                    avatar={props.avatar}
                                />
                                :
                                <LeagueSummary
                                    scoring_settings={props.scoring_settings}
                                />
                        }
                    </td>
                }
            </tr>
        )
    )


    return <>
        <table className="secondary">
            <tbody>
                <tr className="secondary_header">
                    <th colSpan={2}>Manager</th>
                    <th>Record</th>
                    <th>PF</th>
                    <th>PA</th>
                    <th colSpan={5}></th>
                </tr>
            </tbody>
            <tbody className="secondary_content">
                {display}
            </tbody>
        </table>
    </>
}

export default LeagueRosters;