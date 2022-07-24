// Copyright 2021-2022 The Memphis Authors
// Licensed under the Apache License, Version 2.0 (the “License”);
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an “AS IS” BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

export const ApiEndpoints = {
    //Auth
    LOGIN: '/usermgmt/login',
    REFRESH_TOKEN: '/usermgmt/refreshToken',
    ADD_USER: '/usermgmt/addUser',
    GET_ALL_USERS: '/usermgmt/getAllUsers',
    REMOVE_USER: '/usermgmt/removeUser',
    REMOVE_MY_UER: '/usermgmt/removeMyUser',
    EDIT_AVATAR: '/usermgmt/editAvatar',
    GET_COMPANY_LOGO: '/usermgmt/getCompanyLogo',
    EDIT_COMPANY_LOGO: '/usermgmt/editCompanyLogo',
    REMOVE_COMPANY_LOGO: '/usermgmt/removeCompanyLogo',
    EDIT_ANALYTICS: '/usermgmt/editAnalytics',
    SANDBOX_LOGIN: '/sandbox/login',
    DONE_NEXT_STEPS: '/usermgmt/doneNextSteps',

    //Factory
    CREATE_FACTORY: '/factories/createFactory',
    GEL_ALL_FACTORIES: '/factories/getAllFactories',
    GEL_FACTORY: '/factories/getFactory',
    EDIT_FACTORY: '/factories/editFactory',
    REMOVE_FACTORY: '/factories/removeFactory',

    //Station
    CREATE_STATION: '/stations/createStation',
    REMOVE_STATION: '/stations/removeStation',
    GET_STATION: '/stations/getStation',
    GET_ALL_STATIONS: '/stations/getAllStations',
    GET_POISION_MESSAGE_JOURNEY: '/stations/getPoisonMessageJourney',
    GET_MESSAGE_DETAILS: '/stations/getMessageDetails',
    ACK_POISION_MESSAGE: '/stations/ackPoisonMessages',
    RESEND_POISION_MESSAGE_JOURNEY: '/stations/resendPoisonMessages',

    //Producers
    GET_ALL_PRODUCERS_BY_STATION: '/producers/getAllProducersByStation',

    //Consumers
    GET_ALL_CONSUMERS_BY_STATION: '/consumers/getAllConsumersByStation',

    //Monitor
    GET_CLUSTER_INFO: '/monitoring/getClusterInfo',
    GET_MAIN_OVERVIEW_DATA: '/monitoring/getMainOverviewData',
    GET_STATION_DATA: '/monitoring/getStationOverviewData',

    //Logs
    GET_SYS_LOGS: '/logs/getSysLogs'
};
