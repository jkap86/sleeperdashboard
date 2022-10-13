import { useState, useEffect, useRef } from "react"
import Search from "./search"

const PlayerShares = (props) => {
    const [playershares, setPlayershares] = useState([])
    const [searched, setSearched] = useState('')

    useEffect(() => {
        setPlayershares(props.player_shares.sort((a, b) => b.leagues_owned.length - a.leagues_owned.length))
    }, [props])

    const header = (
        <tbody className="main_header">
            <tr>
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
        </tbody>
    )

    const playershares_display = searched.trim().length === 0 ? playershares :
        playershares.filter(x => x.player.full_name?.trim() === searched.trim())

    const display = (
        <table className="wrapper">
            {header}
            {playershares_display.map((player, index) =>
                <tbody className="main_row">
                    <tr>
                        <td colSpan={16}>
                            <table className="main">
                                <tr key={`${player.id}_${index}`}>
                                    <td colSpan={3}>
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
                            </table>
                        </td>
                    </tr>
                </tbody>
            )}
        </table>
    )

    return <>
        <Search
            list={playershares.map(player => player.player.full_name)}
            placeholder={'Search Players'}
            sendSearched={(data) => setSearched(data)}
        />
        <div className="scrollable">
            {display}
        </div>
    </>
}

export default PlayerShares;