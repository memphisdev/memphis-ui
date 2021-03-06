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

const Reducer = (stationState, action) => {
    switch (action.type) {
        case 'SET_STATION_META_DATA':
            return {
                ...stationState,
                stationMetaData: action.payload
            };
        case 'SET_SOCKET_DATA':
            return {
                ...stationState,
                stationSocketData: action.payload
            };
        case 'SET_POISINS_MESSAGES':
            let newState = stationState.stationSocketData;
            newState.poison_messages = action.payload;
            return {
                ...stationState,
                stationSocketData: newState
            };
        default:
            return stationState;
    }
};

export default Reducer;
