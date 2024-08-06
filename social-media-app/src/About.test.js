// About.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // for the "toBeInTheDocument" matcher
import About from './About';

test('renders About component', () => {
    render(<About />);
    
    // Check if the main element with class 'About' is in the document
    const mainElement = screen.getByRole('main', { className: 'About' });
    expect(mainElement).toBeInTheDocument();

    // Check if the heading with text 'About' is in the document
    const headingElement = screen.getByRole('heading', { name: /about/i });
    expect(headingElement).toBeInTheDocument();

    // Check if the paragraph with the specified text is in the document
    const paragraphElement = screen.getByText(/this blog app is a project in the learn react tutorial series/i);
    expect(paragraphElement).toBeInTheDocument();
});
