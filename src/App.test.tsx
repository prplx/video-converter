import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { ApolloProvider } from 'react-apollo-hooks';
import ApolloClient from './apollo';
import App from './App';

const Container = () => (
  <ApolloProvider client={ApolloClient}>
    <App />
  </ApolloProvider>
);

describe('<App />', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Container />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('matches snapshot', () => {
    const component = renderer.create(<Container />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
