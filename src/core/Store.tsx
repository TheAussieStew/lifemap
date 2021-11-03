import {  autorun, isObservable, reaction, toJS } from 'mobx';
import React from 'react'
import { ExampleShen, GraphCorrect, ShenT } from "./LifeGraphModel";
import { stringify } from "flatted";
import { Observer, observer } from 'mobx-react-lite';

export const ShenContext = React.createContext<ShenT>(GraphCorrect.createShen())

export const Store = (props: { children: any }) => {
  const shen = React.useContext(ShenContext)
  autorun(()=> {

      console.log("writing file")
      console.log(toJS(shen.relations))
      const rels = shen.relations.entries()
      console.log("isob shen rels", isObservable(rels))
      localStorage.setItem('shen', stringify(toJS(shen)));
      const saved = localStorage.getItem('shen');
      console.log("isob shen", isObservable(shen))
      console.log("svd", stringify(toJS(shen)))
  })
  // reaction(
  //   () => toJS(shen),
  //   () => {
  //     console.log("writing file using reaction")
  //     localStorage.setItem('shen', stringify(shen));
  //   }
  // );
  return (
    <ShenContext.Provider value={ExampleShen()}>
      {props.children}
    </ShenContext.Provider>
  );
};