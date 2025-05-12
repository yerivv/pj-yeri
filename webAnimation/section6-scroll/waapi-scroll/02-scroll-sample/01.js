import './scroll-timeline.js';

const airplan = document.querySelector('.airplane');
const airplanScrollTimeline = document.querySelector('.airplane-scroll-timeline')

airplan.animate(
    [
        {offsetDistance: '100%'},
        {offsetDistance: '0%'}
    ],
    {
        fill: 'both',
        timeline: new ScrollTimeline({
            scrollOffsets: [
                {target: airplanScrollTimeline, edge: 'start', threshold: 1},
                {target: airplanScrollTimeline, edge: 'end', threshold: 1}
            ]
        })
    }
)
