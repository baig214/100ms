import { HMSReactiveStore, selectRemotePeers } from '@100mslive/hms-video-store';

const hms = new HMSReactiveStore();

// by default subscriber is notified about store changes post subscription only, this can be
// changed to call it right after subscribing too using this function.
hms.triggerOnSubscribe(); // optional, recommended

const actions = hms.getActions();
const store = hms.getStore();
const hmsNotifications = hms.getNotifications();

// Helper function to get URL parameters
function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    const v = urlParams.get(param);
    return v ? v : "";
}

async function run(authToken, toRender) {
    await actions.join({
        userName: "proctor",
        authToken: authToken,
        settings: {
            isAudioMuted: true,
            isVideoMuted: true,
        }
    });

    store.subscribe(peers => {
        const videosContainer = document.getElementById('videos');
        const videoElements = videosContainer.getElementsByTagName('video');

        for (let video of videoElements) {
            const trackID = video.getAttribute('track_id');
            actions.detachVideo(trackID, video);
            console.log(`detachVideo(${trackID})`)
        }

        videosContainer.innerHTML = '';

        peers.forEach(peer => {
            let track;
            if (toRender == 'video') {
                track = peer.videoTrack;
            } else if (toRender == 'screen' && peer.auxiliaryTracks.length > 0) {
                track = peer.auxiliaryTracks[0];
            }

            if (track) {
                const video = document.createElement('video');
                video.autoplay = true;
                video.controls = true;
                video.setAttribute('track_id', track);
                videosContainer.appendChild(video);

                actions.attachVideo(track, video);
                console.log(`attachVideo(${track})`)
            } else {
                console.error(`track not found for peer:${peer.id} toRender:${toRender}`);
            }
        });

    }, selectRemotePeers);
}

// Automatically join the room if authToken is available
const token = getUrlParam('token');
const render = getUrlParam('type').toLowerCase();
if (token && (render === 'video' || render === 'screen')) {
    run(token, render);
} else {
    alert(`missing url param\ntype:${render}\ntoken:${token}`);
}