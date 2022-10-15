

const LeagueSummary = (props) => {

    return <>
        <table className="league_summary">
            {
                Object.keys(props.scoring_settings).slice(0, 5).map((setting, index) =>
                    <tr key={index}>
                        <td>
                            {setting}
                        </td>
                        <td>
                            {props.scoring_settings[setting]}
                        </td>
                    </tr>
                )
            }
        </table>
    </>
}

export default LeagueSummary