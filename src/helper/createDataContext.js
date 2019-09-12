import React, { useReducer, createContext } from 'react';

// method to automate custom context creation
// Params: (reducer: function, actions: , initialState: any)
// Returns: (Context: function, Provider: function): array
const createDataContext = (reducer, actions, initialState) => {
  const Context = createContext();
  const Provider = ({ children }) => {
    // state management with reducer called by dispatch
    const [state, dispatch] = useReducer(reducer, initialState);

    const boundActions = {}; // boundActions = { key1 : boundAction1, key2 : boundAction2, ...]
    for (let thisKey in actions) {
      const valueOfThisKey = actions[thisKey]; // valueOfThisKey === { (dispatch) => dispatch(action) }
      const boundAction = valueOfThisKey(dispatch); // boundAction === dispatch(action)
      boundActions[thisKey] = boundAction; // take in
    }

    return (
      // Context uses Provider to share data across its children.
      <Context.Provider value={{ state, ...boundActions }}>
        {children}
      </Context.Provider>
    );
  };

  return { Context, Provider };
};

export default createDataContext;
