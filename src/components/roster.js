import { useEffect, useState } from "react"
import allplayers from '../allplayers.json'

const Roster = (props) => {
    const [activeRoster, setActiveRoster] = useState(null)
    const [tab, setTab] = useState('Starters')

    useEffect(() => {
        setActiveRoster(props.activeRoster)
    }, [props])

    return activeRoster === null ? null : <>
        <table className="league_summary">
            <tr>
                <th colSpan={4} className="image">
                    <span>
                        {
                            props.avatar(props.user?.avatar, props.user?.display_name, 'user')
                        }
                        <strong>
                            {props.user?.display_name}
                        </strong>
                    </span>
                </th>
            </tr>
            <tr>
                <th>
                    <button onClick={() => setTab('Starters')}>Starters</button>
                </th>
                <th>
                    <button onClick={() => setTab('Bench')}>Bench</button>
                </th>
                <th>
                    <button onClick={() => setTab('Taxi')}>
                        IR
                    </button>
                </th>
                <th>
                    <button onClick={() => setTab('IR')}>
                        Taxi
                    </button>
                </th>
            </tr>
            {
                tab !== 'Starters' ? null :
                    props.roster_positions.filter(x => x !== 'BN').map((slot, index) =>
                        <tr>
                            <td colSpan={1}>
                                {
                                    slot.replace('SUPER_FLEX', 'SF')
                                }
                            </td>
                            <td colSpan={3} className="image">
                                <span>
                                    {
                                        props.avatar(activeRoster.starters[index], allplayers[activeRoster.starters[index]]?.full_name, 'player')
                                    }
                                    <strong>
                                        {
                                            activeRoster.starters[index] === '0' ?
                                                <em>{'Empty'}</em> :
                                                `
                                ${allplayers[activeRoster.starters[index]]?.position}
                                 ${allplayers[activeRoster.starters[index]]?.full_name}
                                 ${allplayers[activeRoster.starters[index]]?.team || 'FA'}
                                `
                                                || 'INACTIVE'
                                        }
                                    </strong>
                                </span>
                            </td>
                        </tr>
                    )
            }
            {
                tab !== 'Bench' ? null :
                    activeRoster.players.filter(x => !activeRoster.starters.includes(x) &&
                        !activeRoster?.taxi?.includes(x) && !activeRoster?.reserve?.includes(x)).map((player, index) =>
                            <tr key={`${player}_${index}`}>
                                <td colSpan={4} className="image">
                                    <span>
                                        {
                                            props.avatar(player, allplayers[player]?.full_name, 'player')
                                        }
                                        <strong>
                                            {
                                                `
                                                ${allplayers[player]?.position}
                                                ${allplayers[player]?.full_name}
                                                ${allplayers[player]?.team || 'FA'}
                                                `
                                            }
                                        </strong>
                                    </span>
                                </td>
                            </tr>

                        )
            }
        </table>
    </>
}

export default Roster;