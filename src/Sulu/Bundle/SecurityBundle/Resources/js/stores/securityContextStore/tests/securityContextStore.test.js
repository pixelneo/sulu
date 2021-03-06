// @flow
import log from 'loglevel';
import securityContextStore from '../securityContextStore';

jest.mock('loglevel', () => ({
    warn: jest.fn(),
}));

jest.mock('sulu-admin-bundle/services/Requester', () => ({
    get: jest.fn(),
}));

beforeEach(() => {
    securityContextStore.suluSecuritySystem = 'Sulu';
    securityContextStore.setSecurityContexts({});
});

test('Load available actions for permissions with given keys', () => {
    securityContextStore.resourceKeyMapping = {
        'test': 'sulu.test',
    };

    securityContextStore.setSecurityContexts({
        'Sulu': {
            'Global': {
                'sulu.snippets': ['view', 'add'],
            },
            'Test': {
                'sulu.test': ['view', 'add', 'edit'],
            },
        },
    });

    return securityContextStore.loadAvailableActions('test').then((actions) => {
        expect(log.warn).toBeCalled();
        expect(actions).toEqual(['view', 'add', 'edit']);
    });
});

test('Load security contexts for entire system', () => {
    securityContextStore.resourceKeyMapping = {
        'test': 'sulu.test',
    };

    const suluSecurityContexts = {
        'Global': {
            'sulu.snippets': ['view', 'add'],
        },
        'Test': {
            'sulu.test': ['view', 'add', 'edit'],
        },
    };

    securityContextStore.setSecurityContexts({Sulu: suluSecurityContexts});

    return securityContextStore.loadSecurityContextGroups('Sulu').then((securityContexts) => {
        expect(log.warn).toBeCalled();
        expect(securityContexts).toEqual(suluSecurityContexts);
    });
});

test('Get available actions for permissions with given keys', () => {
    securityContextStore.resourceKeyMapping = {
        'test': 'sulu.test',
    };

    securityContextStore.setSecurityContexts({
        'Sulu': {
            'Global': {
                'sulu.snippets': ['view', 'add'],
            },
            'Test': {
                'sulu.test': ['view', 'add', 'edit'],
            },
        },
    });

    expect(securityContextStore.getAvailableActions('test')).toEqual(['view', 'add', 'edit']);
    expect(log.warn).not.toBeCalled();
});

test('Get available actions for permissions with given keys and system', () => {
    securityContextStore.resourceKeyMapping = {
        'test': 'sulu.test',
    };

    securityContextStore.setSecurityContexts({
        'Sulu': {
            'Global': {
                'sulu.snippets': ['view', 'add'],
            },
            'Test': {
                'sulu.test': ['view', 'add', 'edit'],
            },
        },
        'Website': {
            'Global': {
                'sulu.snippets': ['view'],
            },
            'Test': {
                'sulu.test': ['view'],
            },
        },
    });

    expect(securityContextStore.getAvailableActions('test')).toEqual(['view', 'add', 'edit']);
    expect(securityContextStore.getAvailableActions('test', 'Sulu')).toEqual(['view', 'add', 'edit']);
    expect(securityContextStore.getAvailableActions('test', 'Website')).toEqual(['view']);
    expect(log.warn).not.toBeCalled();
});

test('Get security contexts for entire system', () => {
    securityContextStore.resourceKeyMapping = {
        'test': 'sulu.test',
    };

    const suluSecurityContexts = {
        'Global': {
            'sulu.snippets': ['view', 'add'],
        },
        'Test': {
            'sulu.test': ['view', 'add', 'edit'],
        },
    };

    securityContextStore.setSecurityContexts({Sulu: suluSecurityContexts});

    expect(securityContextStore.getSecurityContextGroups('Sulu')).toEqual(suluSecurityContexts);
    expect(log.warn).not.toBeCalled();
});

test('Get systems from entire system', () => {
    securityContextStore.resourceKeyMapping = {
        'test': 'sulu.test',
    };

    securityContextStore.setSecurityContexts({
        'Sulu': {
            'Global': {
                'sulu.snippets': ['view', 'add'],
            },
        },
        'Website': {
            'Global': {
                'sulu.snippets': ['view'],
            },
        },
    });

    expect(securityContextStore.getSystems()).toEqual(['Sulu', 'Website']);
});

test('Get security context from resourceKey', () => {
    securityContextStore.resourceKeyMapping = {
        'test': 'sulu.test',
        'foo': 'sulu.foo',
    };

    expect(securityContextStore.getSecurityContextByResourceKey('test')).toEqual('sulu.test');
    expect(securityContextStore.getSecurityContextByResourceKey('foo')).toEqual('sulu.foo');
});
