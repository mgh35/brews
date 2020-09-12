import React from 'react';
import { AmplifySignOut } from '@aws-amplify/ui-react';

export const Header = () => <>
    <h1>Brews</h1>
    <AmplifySignOut />
</>

export default Header;
