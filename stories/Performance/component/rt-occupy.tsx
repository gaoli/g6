import React, { useEffect } from 'react';
import G6 from '../../../src';
import { IGraph } from '../../../src/interface/graph';

let graph: IGraph = null;

const mapNodeSize = (nodes, propertyName, visualRange) => {
  let minp = 9999999999;
  let maxp = -9999999999;
  nodes.forEach(node => {
    node[propertyName] = Math.pow(node[propertyName], 1 / 3);
    minp = node[propertyName] < minp ? node[propertyName] : minp;
    maxp = node[propertyName] > maxp ? node[propertyName] : maxp;
  });
  const rangepLength = maxp - minp;
  const rangevLength = visualRange[1] - visualRange[0];
  nodes.forEach(node => {
    node.size = ((node[propertyName] - minp) / rangepLength) * rangevLength + visualRange[0];
  });
};

const RtOccupy = () => {
  const container = React.useRef();
  useEffect(() => {
    if (!graph) {
      const graphSize = 800;
      const graph = new G6.Graph({
        container: container.current as string | HTMLElement,
        width: graphSize,
        height: graphSize,
        // layout: {
        //   type: 'force',
        //   nodeStrength: -10
        // },
        defaultNode: {
          size: 2,
          style: {
            fill: '#C6E5FF',
            stroke: '#5B8FF9',
            lineWidth: 0.3,
          },
          labelCfg: {
            style: {
              fontSize: 3,
            },
            position: 'right',
            offset: 1,
          },
        },
        defaultEdge: {
          size: 0.1,
          color: '#333',
          type: 'quadratic',
        },
        nodeStateStyles: {
          selected: {
            fill: 'steelblue',
            stroke: '#000',
            lineWidth: 1,
          },
        },
        modes: {
          default: ['zoom-canvas', 'drag-canvas', 'drag-node', 'brush-select'], //'zoom-canvas', 'drag-canvas', 'drag-node',
        },
      });

      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/667ce192-910d-4082-b134-ce78ed46be0a.json',
      )
        .then(res => res.json())
        .then(data => {
          // console.log(data);
          data.nodes.forEach(node => {
            node.label = node.olabel;
            node.degree = 0;
            data.edges.forEach(edge => {
              if (edge.source === node.id || edge.target === node.id) {
                node.degree++;
              }
            });
          });
          mapNodeSize(data.nodes, 'degree', [1, 15]);
          graph.data(data);
          graph.render();

          /* normalize */
          // let cx = 0, cy = 0;
          // let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
          // data.nodes.forEach(node => {
          //   cx += node.x;
          //   cy += node.y;
          //   if (minX > node.x) minX = node.x;
          //   if (minY > node.y) minY = node.y;
          //   if (maxX < node.x) maxX = node.x;
          //   if (maxY < node.y) maxY = node.y;
          // });
          // const scale = maxX - minX > maxY - minY ? maxX - minX : maxY - minY;
          // cx /= data.nodes.length;
          // cy /= data.nodes.length;
          // data.nodes.forEach(node => {
          //   node.x -= cx;
          //   node.y -= cy;
          //   node.x = graphSize * node.x / scale + graphSize / 2;
          //   node.y = graphSize * node.y / scale + graphSize / 2;
          // });
          // graph.positionsAnimate();
          graph.on('node:dragstart', e => {
            graph.setItemState(e.item, 'selected', true);
            e.item.toFront();
          });
        });
    }

    // graph.on('node:mouseenter', evt => {
    //   const { item } = evt
    //   graph.setItemState(item, 'hover', true)
    // })

    // graph.on('node:mouseleave', evt => {
    //   const { item } = evt
    //   graph.setItemState(item, 'hover', false)
    // })
  });
  return <div ref={container}></div>;
};

export default RtOccupy;
