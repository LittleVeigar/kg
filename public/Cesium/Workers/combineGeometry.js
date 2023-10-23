define(['./PrimitivePipeline-558d9cb0', './createTaskProcessorWorker', './Transforms-9e9df299', './Matrix3-fa806b97', './Check-6ede7e26', './defaultValue-fe22d8c0', './Math-dad82b4d', './Matrix2-1e403d0e', './RuntimeError-ef395448', './combine-d9581036', './ComponentDatatype-cf1fa08e', './WebGLConstants-0b1ce7ba', './GeometryAttribute-780af4fa', './GeometryAttributes-ad136444', './GeometryPipeline-36b61c99', './AttributeCompression-8a5a065e', './EncodedCartesian3-e8bbca36', './IndexDatatype-b8f3e09d', './IntersectionTests-e889fcf0', './Plane-c27e1ac6', './WebMercatorProjection-76a3fcc0'], (function (PrimitivePipeline, createTaskProcessorWorker, Transforms, Matrix3, Check, defaultValue, Math, Matrix2, RuntimeError, combine, ComponentDatatype, WebGLConstants, GeometryAttribute, GeometryAttributes, GeometryPipeline, AttributeCompression, EncodedCartesian3, IndexDatatype, IntersectionTests, Plane, WebMercatorProjection) { 'use strict';

  function combineGeometry(packedParameters, transferableObjects) {
    const parameters = PrimitivePipeline.PrimitivePipeline.unpackCombineGeometryParameters(
      packedParameters
    );
    const results = PrimitivePipeline.PrimitivePipeline.combineGeometry(parameters);
    return PrimitivePipeline.PrimitivePipeline.packCombineGeometryResults(
      results,
      transferableObjects
    );
  }
  var combineGeometry$1 = createTaskProcessorWorker(combineGeometry);

  return combineGeometry$1;

}));
//# sourceMappingURL=combineGeometry.js.map
