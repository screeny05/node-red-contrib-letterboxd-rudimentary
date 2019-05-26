import { Red, NodeProperties, Node } from 'node-red';
import { ControllerNodeInterface } from '../controller';

export interface MarkAsWatchedNodeInterface extends Node {
    controllerNode: ControllerNodeInterface;
}

interface MarkAsWatchedNodePropertiesInterface extends NodeProperties {
    controller: string;
}

export const MarkAsWatchedNodeFactory = (RED: Red): any => function MarkAsWatchedNode(this: MarkAsWatchedNodeInterface, props: MarkAsWatchedNodePropertiesInterface): void{
    RED.nodes.createNode(this, props);

    this.controllerNode = RED.nodes.getNode(props.controller) as ControllerNodeInterface;

    const setStatusDisconnected = () => {
        this.status({ fill: 'red', shape: 'dot', text: 'disconnected' });
    };

    const setStatusConnected = () => {
        this.status({ fill: 'green', shape: 'dot', text: 'connected' });
    };

    const setStatusConnecting = () => {
        this.status({ fill: 'green', shape: 'ring', text: 'connecting' });
    };

    setStatusConnecting();
    this.controllerNode.authenticate()
        .then(() => setStatusConnected())
        .catch(() => setStatusDisconnected());

    this.on('input', async (msg) => {
        await this.controllerNode.toggleWatched(msg.payload);
    });
};
