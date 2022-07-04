// Copyright 2021-2022 The Memphis Authors
// Licensed under the GNU General Public License v3.0 (the “License”);
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// https://www.gnu.org/licenses/gpl-3.0.en.html
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an “AS IS” BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { ApiEndpoints } from '../const/apiEndpoints';
import {
    LOCAL_STORAGE_ALREADY_LOGGED_IN,
    LOCAL_STORAGE_AVATAR_ID,
    LOCAL_STORAGE_CREATION_DATE,
    LOCAL_STORAGE_TOKEN,
    LOCAL_STORAGE_EXPIRED_TOKEN,
    LOCAL_STORAGE_USER_ID,
    LOCAL_STORAGE_USER_NAME,
    LOCAL_STORAGE_USER_TYPE,
    LOCAL_STORAGE_ALLOW_ANALYTICS
} from '../const/localStorageConsts';
import pathDomains from '../router';
import { httpRequest } from './http';

const AuthService = (function () {
    const saveToLocalStorage = (userData) => {
        const now = new Date();
        const expiryToken = now.getTime() + userData.expires_in;

        localStorage.setItem(LOCAL_STORAGE_ALREADY_LOGGED_IN, userData.already_logged_in);
        localStorage.setItem(LOCAL_STORAGE_AVATAR_ID, userData.avatar_id);
        localStorage.setItem(LOCAL_STORAGE_CREATION_DATE, userData.creation_date);
        localStorage.setItem(LOCAL_STORAGE_TOKEN, userData.jwt);
        localStorage.setItem(LOCAL_STORAGE_USER_ID, userData.user_id);
        localStorage.setItem(LOCAL_STORAGE_USER_NAME, userData.username);
        localStorage.setItem(LOCAL_STORAGE_USER_TYPE, userData.user_type);
        localStorage.setItem(LOCAL_STORAGE_EXPIRED_TOKEN, expiryToken);
        localStorage.setItem(LOCAL_STORAGE_ALLOW_ANALYTICS, userData.send_analytics);
    };

    const logout = () => {
        localStorage.clear();
        window.location.assign(pathDomains.login);
    };

    const isValidToken = () => {
        const tokenExpiryTime = localStorage.getItem(LOCAL_STORAGE_EXPIRED_TOKEN);
        if (Date.now() <= tokenExpiryTime) {
            return true;
        } else {
            return false;
        }
    };

    return {
        saveToLocalStorage,
        logout,
        isValidToken
    };
})();
export default AuthService;
