import React from 'react';
import { shallow } from 'enzyme';

import Node from '../index';

describe('<Node />', () => {
  const nodeData = {
    id: 'abc123',
    name: 'mockNode',
    x: 123,
    y: 321,
  };

  it('should have the correct `id` attribute value', () => {
    const renderedComponent = shallow(
      <Node
        nodeData={nodeData}
        orientation="horizontal"
      />
    );

    expect(renderedComponent.find('g').prop('id')).toBe(nodeData.id);
  });

  it('should apply correct base className if `nodeData._children` is defined', () => {
    const noChildrenComponent = shallow(
      <Node
        nodeData={nodeData}
        orientation="horizontal"
      />
    );
    const withChildrenComponent = shallow(
      <Node
        nodeData={{ ...nodeData, _children: [] }}
        orientation="horizontal"
      />
    );

    expect(noChildrenComponent.prop('className')).toBe('leafNodeBase');
    expect(withChildrenComponent.prop('className')).toBe('nodeBase');
  });

  it('should apply correct <circle> style prop if `nodeData._children` is defined', () => {
    const leafCircleStyle = { fill: 'blue' };
    const circleStyle = { fill: 'green' };
    const noChildrenComponent = shallow(
      <Node
        nodeData={nodeData}
        orientation="horizontal"
        leafCircleStyle={leafCircleStyle}
        circleStyle={circleStyle}
      />
    );
    const withChildrenComponent = shallow(
      <Node
        nodeData={{ ...nodeData, _children: [] }}
        orientation="horizontal"
        leafCircleStyle={leafCircleStyle}
        circleStyle={circleStyle}
      />
    );

    expect(noChildrenComponent.find('circle').prop('style')).toBe(leafCircleStyle);
    expect(withChildrenComponent.find('circle').prop('style')).toBe(circleStyle);
  });

  it('should apply correct `transform` prop, depending on parent `orientation`', () => {
    const horizontalTransform = `translate(${nodeData.y},${nodeData.x})`;
    const verticalTransform = `translate(${nodeData.x},${nodeData.y})`;
    const horizontalComponent = shallow(
      <Node
        nodeData={nodeData}
        orientation="horizontal"
      />
    );
    const verticalComponent = shallow(
      <Node
        nodeData={nodeData}
        orientation="vertical"
      />
    );

    expect(horizontalComponent.prop('transform')).toBe(horizontalTransform);
    expect(verticalComponent.prop('transform')).toBe(verticalTransform);
  });

  it('should take an `onClick` prop', () => {
    const renderedComponent = shallow(
      <Node
        nodeData={nodeData}
        orientation="horizontal"
        onClick={() => {}}
      />
    );

    expect(renderedComponent.prop('onClick')).toBeDefined();
  });

  it('should handle click events and pass the nodeId to onClick handler', () => {
    const onClickSpy = jest.fn();
    const renderedComponent = shallow(
      <Node
        nodeData={nodeData}
        orientation="horizontal"
        onClick={onClickSpy}
      />
    );

    renderedComponent.simulate('click');
    expect(onClickSpy).toHaveBeenCalledWith(nodeData.id);
  });

  it('should map each `props.secondaryLabels` to a <tspan> element', () => {
    const fixture = { keyA: 'valA', keyB: 'valB' };
    const renderedComponent = shallow(
      <Node
        nodeData={nodeData}
        orientation="horizontal"
        secondaryLabels={fixture}
      />
    );
    const textNode = renderedComponent
      .find('text')
      .findWhere((n) => n.prop('className') === 'secondaryLabelsBase');

    expect(textNode.findWhere((n) =>
      n.text() === `keyA: ${fixture.keyA}`).length
    ).toBe(1);
    expect(textNode.findWhere((n) =>
      n.text() === `keyB: ${fixture.keyB}`).length
    ).toBe(1);
  });
});