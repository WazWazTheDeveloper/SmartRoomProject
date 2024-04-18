import { useEffect, useRef } from "react";

function useDidMount(fn:Function, inputs:any[]) {
    const didMountRef = useRef(false);
  
    useEffect(() => {
      if (didMountRef.current) { 
        return fn();
      }
      didMountRef.current = true;
    }, inputs);
  }

  export default useDidMount