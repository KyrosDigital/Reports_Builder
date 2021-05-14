import React, { useState } from 'react';


export function MyControlledInput(collections : any) {

    // to submit the formula
    const [staging, setStaging] = useState(0)
    // used for input
    const [value, setValue] = useState('');
    // displaying stuff in the buttons
    const [queryChooser, setQueryChooser] = useState<any>({});
    // for the update choices, I just need the first if statement to run once
    const [counter, setCounter] = useState<any>({})
    // holds all queries, hopefully under the key of the variable they're replacing
    const [queries, setQueries] = useState<any>({})
    // all possible variable names
    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 
    'x', 'y', 'z']
  
    const onChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
      setValue(event.target.value);
    };


    function updateChoices(the: string, el : string) {
        if (counter[el] < 1) {
            console.log("the (element): ", the)
            let temp:{[k: string] : any} = queries
            temp[el] = {}
            let count = counter
            count[el] = 1
            setCounter(count)
            temp[el]["collectionName"] = the
            temp[el]["path"] = "data"
            setQueries(temp)
            var keys = queryChooser
            keys[el] = Object.keys(collections.collections[the]["data"])
            setQueryChooser(keys)
            console.log("queryChooser: ", queryChooser)
            console.log("queries", queries)
        } else { // we are assuming no nested objects
            console.log("the (element): ", the)
            let temp = queries
            temp[el]["path"] = temp[el]["path"].concat("." + the)
            setQueries(temp)
            console.log(queries)
        }
    }
    
    const handleButtonClicked = () => {
        if (staging == 0) {
            var vars: any[] = []
            for (var i = 0; i < value.length; i++) {
                if (alphabet.includes(value[i])) {
                    
                    // setting variables(keys for other stuff)
                    vars.push(value[i])
                }
            }
            
            var temp_queries:{[k: string] : any} = {}
            var temp_queryChooser:{[k: string] : any} = {}
            var temp_counter:{[k: string] : any} = {}
            for (var i = 0; i < vars.length; i++) {
                temp_queries[vars[i]] = false
                temp_queryChooser[vars[i]] = Object.keys(collections.collections)
                temp_counter[vars[i]] = 0
            }
            setQueries(temp_queries)
            setQueryChooser(temp_queryChooser)
            setCounter(temp_counter)
            console.log("queryChooser: ", queryChooser)
            setStaging(1)
        } else {
            setQueryChooser({})
            setCounter({})
            setStaging(0)
            setValue('')
        }
        
    }

    return (
      <>
        <p>Click 'Submit' to define variables, click it again to finalize it</p>
        <div>Input equation: {value}</div>
        <input value={value} onChange={onChange} />
        <button onClick={handleButtonClicked}> submit</button>
        <div className="query_selection"> 
            {Object.keys(queryChooser).map((el : string, ind) => {
                return <div key = {ind} className = ""> {el} = 
                    {queryChooser[el].map((element : string, index : number) => {
                        console.log("element: ", element)
                        return <button key = {index} onClick={() => updateChoices(element, el)}> {element} </button>
                    })}
                    </div>
            })}
        </div>
      </>
    );
}
