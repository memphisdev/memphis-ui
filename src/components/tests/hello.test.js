/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import Hello from './hello';
import ReactDOM from 'react-dom';

it('renders "Hello"', () => {
    render(<Hello />);
    const myElememt = screen.getByText('Hello');
    expect(myElememt).toBeInTheDocument();
});
