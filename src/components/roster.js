import { useEffect, useState } from "react"

const Roster = (props) => {
    const [activeRoster, setActiveRoster] = useState(null)

    useEffect(() => {
        setActiveRoster(props.activeRoster)
    }, [props])

    return activeRoster === null ? null : <>
        <table className="league_summary">
            <caption>{props.user?.display_name}</caption>
            <tr>
                <th colSpan={2}>Starters</th>
            </tr>
            {props.roster_positions.filter(x => x !== 'BN').map((slot, index) =>
                <tr>
                    <td>{slot}</td>
                    <td>
                        {
                            activeRoster.players.find(x => x.player_id === activeRoster.starters[index])?.full_name ?? 'Empty'
                        }
                    </td>
                </tr>
            )}
        </table>
    </>
}

export default Roster;