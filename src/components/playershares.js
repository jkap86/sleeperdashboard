

const PlayerShares = (props) => {
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
                    Diff
                </em>
            </th>
        </tr>
    )

    const player_shares = props.player_shares.map((player, index) =>
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
                        (player.leagues_owned.reduce((acc, cur) => acc + cur.fpts, 0) -
                            player.leagues_owned.reduce((acc, cur) => acc + cur.fpts_against, 0)).toLocaleString("en-US")
                    }
                </em>
            </td>
        </tr>
    )

    return <>
        <h1>PlayerShares</h1>
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