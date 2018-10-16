import * as React from 'react';

import { hot } from 'react-hot-loader';

import styled from 'styled-components';

// import { GlobalStyles } from '@styles';

const StyledHome = styled.div``;

class HomeComponent extends React.Component {
  public render() {
    return (
      <StyledHome>
        Hello World
        {/* <GlobalStyles /> */}
      </StyledHome>
    );
  }
}

export const Home = hot(module)(HomeComponent);
