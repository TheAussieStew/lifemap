import {  autorun, isObservable, reaction, toJS } from 'mobx';
import React from 'react'
import { ExampleShen, GraphCorrect, ShenT } from "./LifeGraphModel";
import { stringify, parse } from "flatted";
import { Observer, observer } from 'mobx-react-lite';

export const ShenContext = React.createContext<ShenT>(GraphCorrect.createShen())

const download = (content: any, fileName: string, contentType: string) => {
  var a = document.createElement("a");
  var file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
};
// download(stringify(toJS(shen)), 'shen.txt', 'text/plain');

export const Store = (props: { children: any }) => {
  let shen: ShenT = React.useContext(ShenContext)
  let loaded = false;
  const dispose = autorun(() => {
    if (!loaded) {
      const localStorageShen = localStorage.getItem("shen")
      if (localStorageShen !== null) {
        shen = parse(localStorage.getItem("shen")!);
        console.log("getting shen from storage", shen);
        loaded = true;
      }
    }
    toJS(shen)
    console.log("writing file");
    console.log(stringify(toJS(shen)))
    localStorage.setItem("shen", stringify(toJS(shen)));
  });
  React.useEffect(() => {
    // clean up dispose here
  })
  return (
    <ShenContext.Provider value={ExampleShen()}>
      {props.children}
    </ShenContext.Provider>
  );
};