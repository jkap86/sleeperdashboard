import React, { useEffect, useRef, useState } from "react";

const Search = (props) => {
    const [searched, setSearched] = useState('')

    useEffect(() => {
        props.sendSearched(searched)
    }, [searched])


    /*
        const handleClear = () => {
            searchRef.current.value = ''
            props.sendSearched('')
        }
    
        const searchList = (item) => {
            searchRef.current.value = item
            props.sendSearched(item)
        }
    */
    return <>
        <input
            onChange={(e) => setSearched(e.target.value)}
            id={props.id === undefined ? null : props.id}
            list={props.placeholder}
            placeholder={props.placeholder}
            type="text"
            value={searched}
        />
        <datalist id={props.placeholder}>
            {props.list.sort((a, b) => a > b ? 1 : -1).map((i, index) =>
                <option key={index}>{i}</option>
            )}
        </datalist>
        <button onClick={(e) => setSearched('')} className="clear" type="reset">Clear</button>
    </>
}

export default Search;