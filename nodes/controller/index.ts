import { Red, NodeProperties, Node } from 'node-red';
import { getSlugByIndexIds, toggleWatched, getAuthenticatedJar } from '../../lib/letterboxd';
import { CookieJar } from 'tough-cookie';

export interface ControllerNodeInterface extends Node {
    username: string;
    password: string;
    cookieJar?: CookieJar;
    reauthenticate(): Promise<void>;
    authenticate(): Promise<void>;
    toggleWatched(msg: { tmdbId?: string, imdbId?: string, isWatched: boolean }): Promise<void>;
    checkAuthentication(): void;
}

interface ControllerNodePropertiesInterface extends NodeProperties {
    username: string;
    password: string;
}

export const ControllerNodeFactory = (RED: Red): any => function ControllerNode(this: ControllerNodeInterface, props: ControllerNodePropertiesInterface): void{
    RED.nodes.createNode(this, props);

    this.username = props.username;
    this.password = props.password;

    this.reauthenticate = async () => {
        this.cookieJar = await getAuthenticatedJar(this.username, this.password);
    };

    this.authenticate = async () => {
        if(!this.cookieJar){
            await this.reauthenticate();
        }
    };

    this.checkAuthentication = () => {
        if(!this.cookieJar){
            throw new Error('Not authenticated, yet.');
        }
    };

    this.toggleWatched = async (msg) => {
        this.checkAuthentication();
        const slug = await getSlugByIndexIds(msg.imdbId, msg.tmdbId);
        await toggleWatched(slug, msg.isWatched, this.cookieJar!);
    };

    this.on('close', () => {
        this.cookieJar = undefined;
    });
};
