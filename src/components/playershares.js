import { useState, useEffect } from "react"
import Search from "./search"

const PlayerShares = (props) => {
    const [playershares, setPlayershares] = useState([])

    useEffect(() => {
        setPlayershares(props.player_shares.sort((a, b) => b.leagues_owned.length - a.leagues_owned.length))
    }, [props])

    const searchPlayers = (player_name) => {
        let ps = playershares
        if (player_name !== undefined && player_name.trim().length > 0) {
            ps.map(player => {
                return player.isHidden = true
            })
            ps.filter(x => x.player.full_name?.trim() === player_name.trim()).map(player => {
                return player.isHidden = false
            })
        } else {
            ps.map(player => {
                return player.isHidden = false
            })
        }
        setPlayershares([...ps])
    }

    const header = (
        <tr className="main_header">
            <th colSpan={3}>
                Name
            </th>
            <th colSpan={2}>
                Leagues
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
            <th colSpan={2}>
                PF
            </th>
            <th colSpan={2}>
                PA
            </th>
            <th colSpan={2}>
                <em>
                    Avg Diff
                </em>
            </th>
        </tr>
    )

    const player_shares = playershares.filter(x => (x.isHidden === false || x.isHidden === undefined)).map((player, index) =>
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
            <td colSpan={2}>
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
            <td colSpan={2}>
                {
                    player.leagues_owned.reduce((acc, cur) => acc + cur.fpts, 0).toLocaleString("en-US")
                }
            </td>
            <td colSpan={2}>
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
    )

    return <>
        <Search
            list={playershares.map(player => player.player.full_name)}
            placeholder={'Search Players'}
            sendSearched={(data) => searchPlayers(data)}
        />
        <div className="scrollable">
            <table className="main playershares">
                <tbody>
                    {header}
                    {player_shares}
                </tbody>
            </table>
        </div>
    </>
}

export default PlayerShares;