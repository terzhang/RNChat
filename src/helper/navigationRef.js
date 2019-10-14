import { NavigationActions } from 'react-navigation';

let navigator; // navigator storage variable
/* 
  clever trick to mimic withNavigation without the need for HOC wrapper
  use this helper function to directly call and navigate to a specified route
  outside of a Component.
*/

// Take the given navigator and store it here.
export const setNavigator = nav => {
  navigator = nav;
};

// using the stored navigator, dispatch an action to the navigator state.
// tell navigator to navigate to a specified route with params.
export const navigate = (routeName, params) => {
  navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  );
};
