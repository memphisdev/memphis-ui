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

export const CODE_EXAMPLE = `const memphis = require("memphis-dev");

(async function () {
    try {
        await memphis.connect({
            host: "<memphis-cluster>",
            username: "<user of type application>",
            connectionToken: "<connectio_token>"
        });
        
        // consumer
        
        const consumer = await memphis.consumer({
            stationName: "test",
            consumerName: "consumer_app",
            consumerGroup: ""
        });
        consumer.on("message", message => {
            console.log(message.getData().toString());
            message.ack();
        });
        consumer.on("error", error => {
            console.log(error);
        });

        // producer

        const producer = await memphis.producer({
            stationName: "test",
            producerName: "producer_app"
        });
        for (let index = 0; index < 100; index++) {
            await producer.produce({
                message: Buffer.from('Hello world')
            });
            console.log("Message sent");
        }
        console.log("All messages sent");
    } catch (ex) {
        console.log(ex);
        memphis.close();
    }
})();`;

export const DOCKER_CODE_EXAMPLE = `const memphis = require("memphis-dev");
​
(async function () {
    try {
        await memphis.connect({
            host: "localhost",
            username: "<user of type application>",
            connectionToken: "memphis"
        });
​
        // consumer

        const consumer = await memphis.consumer({
            stationName: "test",
            consumerName: "consumer_app",
            consumerGroup: ""
        });
​
        consumer.on("message", message => {
            console.log(message.getData().toString());
            message.ack();
        });
​
        consumer.on("error", error => {
            console.log(error);
        });

        // producer
        
        const producer = await memphis.producer({
            stationName: "test",
            producerName: "producer_app"
        });
​
        const promises = [];
        for (let index = 0; index < 100; index++) {
            promises.push(producer.produce({
                message: Buffer.from('Hello world')
            }));
            console.log("Message sent");
        }
​
        await Promise.all(promises);
        console.log("All messages sent");
    } catch (ex) {
        console.log(ex);
        memphis.close();
    }
})();`;
