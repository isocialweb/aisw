export function splitArrayIntoGroups(array, groupSize) {
    let groups = [];
    let group = [];
    
    for (let i = 0; i < array.length; i++) {
      group.push(array[i]);
      
      if ((i + 1) % groupSize === 0 || i === array.length - 1) {
        groups.push(group);
        group = [];
      }
    }
        return groups;
  }


  export function parseString(data,setButtonState) {
    try{const firstregex = /},/g;
    const a = data.replace(firstregex, "}");
    const secondRegex = /}/g;
    const b = a.replace(secondRegex, "},");
    const c = b.replace(/,$/g, "");
    const d = c.replace(/^/g, "[");
    const final = d.replace(/$/g, "]");
    
    return JSON.parse(final);
    }catch(error){
      console.log("Ha fallado parseString")
      setButtonState("error")

    }
    
    
  }


  // export function parseString(data) {
  //   try {
  //     const firstregex = /},/g;
  //     const a = data.replace(firstregex, "}");
  //     const secondRegex = /}/g;
  //     const b = a.replace(secondRegex, "},");
  //     const c = b.replace(/,$/g, "");
  //     const d = c.replace(/^/g, "[");
  //     const final = d.replace(/$/g, "]");
  
  //     return { result: JSON.parse(final), error: false };
  //   } catch (error) {
  //     // console.log("Ha fallado parseString");
  //     return null
  //   }
  // }
  