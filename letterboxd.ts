import { Red } from 'node-red';
import { MarkAsWatchedNodeFactory } from './nodes/mark-as-watched';
import { ControllerNodeFactory } from './nodes/controller';

module.exports = (RED: Red): void => {
    RED.nodes.registerType('letterboxd-controller', ControllerNodeFactory(RED));
    RED.nodes.registerType('letterboxd-mark-as-watched', MarkAsWatchedNodeFactory(RED));
};
