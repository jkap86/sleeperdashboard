import { useEffect, useState } from "react"

const Roster = (props) => {
    const [activeRoster, setActiveRoster] = useState(null)

    useEffect(() => {
        setActiveRoster(props.activeRoster)
    }, [props])

    console.log(activeRoster)

    return activeRoster === null ? null : <>
        <table className="league_summary">
            <caption>{props.user?.display_name}</caption>
            <tr>
                <th>Starters</th>
            </tr>
            {activeRoster?.players?.map(player =>
                <tr>
                    <td>{activeRoster.players.find(x => x.id === player)?.full_name}</td>
                </tr>
            )}
        </table>
    </>
}

export default Roster;