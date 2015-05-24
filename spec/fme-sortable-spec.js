// Generated by CoffeeScript 1.9.2
(function() {
  describe('fmeSortable', function() {
    beforeEach(inject(function($rootScope, $compile, $timeout) {
      this.timeout = $timeout;
      this.scope = $rootScope.$new();
      this.compile = $compile;
      this.scope.onDrop = function() {
        return false;
      };
      this.scope.sortable = function() {
        return false;
      };
      this.scope.array_of_models = [
        {
          name: 'test1'
        }, {
          name: 'test2'
        }, {
          name: 'test3'
        }
      ];
      this.element = angular.element("<ul><li id='item_{{$index}}' fme-sortable='true'  fme-index='$index' fme-list='array_of_models'  ng-repeat='model in array_of_models' fme-on-drop='onDrop()'>{{model.name}}</li></ul>");
      this.compile(this.element)(this.scope);
      this.scope.$digest();
      this.element_not_sortable = angular.element("<ul><li id='item_not_sortable_{{$index}}' fme-sortable='true' fme-index='$index' fme-list='array_of_models'  ng-repeat='model in array_of_models' on-drop='onDrop()' fme-not-sortable='!sortable()'>{{model.name}}</li></ul>");
      this.compile(this.element_not_sortable)(this.scope);
      return this.scope.$digest();
    }));
    afterEach(function() {
      this.element.remove();
      return this.element_not_sortable.remove();
    });
    describe('draggableAttr', function() {
      it('is draggable by default', function() {
        var element_has_draggable_attribute;
        element_has_draggable_attribute = false;
        angular.forEach(this.element[0].children[0].attributes, function(attribute, key) {
          if (attribute['name'] === 'draggable') {
            return element_has_draggable_attribute = true;
          }
        });
        return expect(element_has_draggable_attribute).to.be["true"];
      });
      return it('is not draggable if it is marked not sortable', function() {
        var element_has_draggable_attribute;
        element_has_draggable_attribute = false;
        angular.forEach(this.element_not_sortable[0].children[0].attributes, function(attribute, key) {
          if (attribute['name'] === 'draggable') {
            return element_has_draggable_attribute = true;
          }
        });
        return expect(element_has_draggable_attribute).to.be["false"];
      });
    });
    describe('dragstart', function() {
      context('when the event is fired by jquery it uses event.originalEvent', function() {
        return it('makes the index available to the event handler for future use during draghover, drop, etc', function() {
          var mockEvent;
          mockEvent = $.Event('dragstart');
          mockEvent.originalEvent = {
            dataTransfer: {
              setData: function(type, data) {
                return true;
              }
            }
          };
          sinon.stub(mockEvent.originalEvent.dataTransfer, 'setData');
          this.element.find('li:first').triggerHandler(mockEvent);
          expect(mockEvent.originalEvent.dataTransfer.setData).to.be.called;
          return mockEvent.originalEvent.dataTransfer.setData.restore();
        });
      });
      return context('when the event is NOT fired by jquery it uses event', function() {
        return it('makes the index available to the event handler for future use during draghover, drop, etc', function() {
          var mockEvent;
          mockEvent = $.Event('dragstart');
          mockEvent.dataTransfer = {
            setData: function(type, data) {
              return true;
            }
          };
          sinon.stub(mockEvent.dataTransfer, 'setData');
          this.element.find('li:first').triggerHandler(mockEvent);
          expect(mockEvent.dataTransfer.setData).to.be.called;
          return mockEvent.dataTransfer.setData.restore();
        });
      });
    });
    describe('dragover', function() {
      context('when the event is fired by jquery it uses event.originalEvent', function() {
        return it('prevents the default browser action and tells the event to set the drop effect to move', function() {
          var mockEvent;
          mockEvent = $.Event('dragover');
          mockEvent.originalEvent = {
            dataTransfer: {
              dropEffect: 'something'
            }
          };
          sinon.stub(mockEvent, 'preventDefault');
          this.element.find('li:first').triggerHandler(mockEvent);
          expect(mockEvent.preventDefault).to.be.called;
          expect(mockEvent.originalEvent.dataTransfer.dropEffect).to.eq('move');
          expect(this.element.find('li:first').hasClass('dropzone')).to.be["true"];
          return mockEvent.preventDefault.restore();
        });
      });
      context('when the event is NOT fired by jquery it uses event', function() {
        return it('prevents the default browser action and tells the event to set the drop effect to move', function() {
          var mockEvent;
          mockEvent = $.Event('dragover');
          mockEvent.dataTransfer = {
            dropEffect: 'something'
          };
          sinon.stub(mockEvent, 'preventDefault');
          this.element.find('li:first').triggerHandler(mockEvent);
          expect(mockEvent.preventDefault).to.be.called;
          expect(mockEvent.dataTransfer.dropEffect).to.eq('move');
          expect(this.element.find('li:first').hasClass('dropzone')).to.be["true"];
          return mockEvent.preventDefault.restore();
        });
      });
      return it('does not set the drop effect when it is the element being dragged', function() {
        var mockDragOverEvent, mockDragStartEvent;
        mockDragStartEvent = $.Event('dragstart');
        mockDragStartEvent.dataTransfer = {
          setData: function(type, data) {
            return true;
          }
        };
        sinon.stub(mockDragStartEvent.dataTransfer, 'setData');
        mockDragOverEvent = $.Event('dragover');
        mockDragOverEvent.dataTransfer = {
          dropEffect: 'something'
        };
        sinon.stub(mockDragOverEvent, 'preventDefault');
        this.element.find('li:first').triggerHandler(mockDragStartEvent);
        this.element.find('li:first').triggerHandler(mockDragOverEvent);
        return expect(mockDragOverEvent.dataTransfer.dropEffect).not.to.eq('move');
      });
    });
    describe('dragleave', function() {
      return it('removes the dropzone class from the item', function() {
        var mockDragLeaveEvent, mockDragOverEvent;
        mockDragOverEvent = $.Event('dragover');
        mockDragOverEvent.dataTransfer = {
          dropEffect: 'something'
        };
        sinon.stub(mockDragOverEvent, 'preventDefault');
        this.element.find('li:first').triggerHandler(mockDragOverEvent);
        expect(this.element.find('li:first').hasClass('dropzone')).to.be["true"];
        mockDragLeaveEvent = $.Event('dragleave');
        this.element.find('li:first').triggerHandler(mockDragLeaveEvent);
        expect(this.element.find('li:first').hasClass('dropzone')).to.be["false"];
        return mockDragOverEvent.preventDefault.restore();
      });
    });
    return describe('drop', function() {
      context('when the first item is dropped on the last item', function() {
        return it('reorders the model array such that the first item is last and the last item is second to last {1,2,3} => {2,3,1}', function() {
          var mockDropEvent;
          mockDropEvent = $.Event('drop');
          mockDropEvent.originalEvent = {
            dataTransfer: {
              getData: function(type) {
                return true;
              }
            }
          };
          sinon.stub(mockDropEvent.originalEvent.dataTransfer, 'getData').returns('0');
          sinon.stub(this.scope, 'onDrop');
          this.element.find('li:last').triggerHandler(mockDropEvent);
          this.timeout.flush();
          expect(this.element.find('li:last').hasClass('dropzone')).to.be["false"];
          expect(this.scope.onDrop).to.be.called;
          expect(this.scope.array_of_models[0].name).to.equal('test2');
          expect(this.scope.array_of_models[1].name).to.equal('test3');
          expect(this.scope.array_of_models[2].name).to.equal('test1');
          this.scope.onDrop.restore();
          return mockDropEvent.originalEvent.dataTransfer.getData.restore();
        });
      });
      return context('when the last item is dropped on the first item', function() {
        return it('reorders the model array such that the last item is first and the first item is second {1,2,3} => {3,1,2}', function() {
          var mockDropEvent;
          mockDropEvent = $.Event('drop');
          mockDropEvent.dataTransfer = {
            getData: function(type) {
              return true;
            }
          };
          sinon.stub(mockDropEvent.dataTransfer, 'getData').returns('2');
          sinon.stub(this.scope, 'onDrop');
          this.element.find('li:first').triggerHandler(mockDropEvent);
          this.timeout.flush();
          expect(this.element.find('li:first').hasClass('dropzone')).to.be["false"];
          expect(this.scope.onDrop).to.be.called;
          expect(this.scope.array_of_models[0].name).to.equal('test3');
          expect(this.scope.array_of_models[1].name).to.equal('test1');
          expect(this.scope.array_of_models[2].name).to.equal('test2');
          this.scope.onDrop.restore();
          return mockDropEvent.dataTransfer.getData.restore();
        });
      });
    });
  });

}).call(this);
