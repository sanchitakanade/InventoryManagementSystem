/* Author: Sanchita Kanade
   File: DisplayImage.jsx
*/

import React from 'react';
import { images } from './ProductTable.jsx';

export default function displayImage({ match }) {
  const { id } = match.params;
  return (
    <img src={images[id]} alt="" />
  );
}
