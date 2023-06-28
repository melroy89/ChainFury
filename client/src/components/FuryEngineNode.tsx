import { Dialog, Tooltip } from '@mui/material';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import { Field, Output } from '../redux/slices/authSlice';
import SvgTrash from './SvgComps/Trash';
import { useEffect, useRef, useState } from 'react';
import SvgClose from './SvgComps/Close';

export interface FuryData {
  deleteMe: () => void;
  id: string;
  type: string;

  node: {
    name: string;
    outputs: Output[];
    description: string;
    fields: Field[];
    fn?: {
      node_id?: string;
      model_id?: string;
      model_params?: any;
      model?: {
        collection_name: string;
        id: string;
        description: string;
        tags: string[];
        vars: any[];
      };
    };
  };
}

export const FuryEngineNode = ({ data }: { data: FuryData }) => {
  const [showAddition, setShowAddition] = useState(false);
  const [haveAdditionalFields, setHaveAdditionalFields] = useState(false);

  return (
    <div
      className={`w-[350px] border border-light-neutral-grey-200 rounded-[4px] shadow-sm  prose-nbx relative bg-light-system-bg-primary`}
    >
      <img
        src={'https://api.dicebear.com/6.x/shapes/svg?seed=' + data?.type}
        className="absolute top-0 z-0 h-full object-cover blur-[4px] opacity-[0.1]"
      />
      <div className="flex flex-col relative z-10">
        <div className="p-[8px] bg-light-system-bg-secondary medium350 flex justify-between items-center border-b">
          <span className="semiBold250 text-light-neutral-grey-500  gap-[8px]">
            {(data?.node?.name || data?.id) ?? ''}
          </span>
          <div
            className="cursor-pointer"
            onClick={() => {
              console.log('delete me', data);
              data?.deleteMe?.();
            }}
          >
            <SvgTrash className="stroke-light-neutral-grey-500" />
          </div>
        </div>

        <div className="w-full h-full p-[8px]">
          {showAddition ? (
            <AdditionalFieldsModal
              data={data}
              onClose={() => {
                setShowAddition(false);
              }}
            />
          ) : (
            <></>
          )}
          <div className="w-full text-gray-500 text-sm py-[4px]">{data?.node?.description}</div>
          <div className="flex flex-col">
            {data?.node?.fields?.map((field, key) => {
              return field.required ? (
                <div key={key} className="flex flex-col gap-[8px] relative">
                  <Tooltip title={'(required)'}>
                    <Handle
                      type={'target'}
                      // position={left ? Position.Left : Position.Right}
                      id={field?.name}
                      isValidConnection={(connection) => {
                        // const sourceArr = connection?.sourceHandle?.split('|')?.filter((t) => t !== '') ?? [];
                        // const targetArr = connection?.targetHandle?.split('|')?.filter((t) => t !== '') ?? [];
                        // const hasCommonElement = sourceArr.some((item) => targetArr.includes(item));
                        // if (hasCommonElement) {
                        //   return true;
                        // }
                        // const hasCommonElement = connection?.source?.split('|')?.some();
                        // console.log(connection);
                        return true;
                      }}
                      className={
                        'p-[2px] rounded-[2px!important] border border-[#000!important] bg-[#fff!important]  dark:bg-dark-system-bg-primary bg-light-system-bg-primary  left-[-12px!important]'
                      }
                      position={Position.Left} // style={{
                      //   borderColor: color,
                      //   top: position
                      // }}
                    ></Handle>
                  </Tooltip>
                  <span className="medium400 text-light-neutral-grey-600 flex items-center gap-[4px] p-[8px]">
                    {typeof field?.type === 'string'
                      ? GetFuryInput(data, field?.name, field?.type, key)
                      : GetFuryInput(data, field?.name, field?.type?.[0]?.type, key)}
                    {/* {field?.placeholder} */}
                  </span>
                </div>
              ) : (
                <>
                  {(() => {
                    if (!haveAdditionalFields) setHaveAdditionalFields(true);
                  })()}
                </>
              );
            })}
            {haveAdditionalFields ? (
              <div
                onClick={() => {
                  setShowAddition(true);
                }}
                className="flex text-center justify-center rounded-sm cursor-pointer hover:bg-light-primary-blue-50 py-[4px] w-full border border-light-neutral-grey-200"
              >
                Additonal Fields
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
        <div className="py-[8px] flex flex-col gap-[8px]">
          <span className="medium400 text-light-neutral-grey-600 flex items-center gap-[4px] p-[8px]">
            Output
          </span>
          <div>
            {data?.node?.outputs?.map((output, key) => {
              return (
                <div key={key} className="rounded-md p-[4px] medium300 relative text-right">
                  <Tooltip title={' (required)'}>
                    <Handle
                      type={'source'}
                      // position={left ? Position.Left : Position.Right}
                      id={output?.name}
                      isValidConnection={(connection) => {
                        // const sourceArr = connection?.sourceHandle?.split('|')?.filter((t) => t !== '') ?? [];
                        // const targetArr = connection?.targetHandle?.split('|')?.filter((t) => t !== '') ?? [];
                        // const hasCommonElement = sourceArr.some((item) => targetArr.includes(item));
                        // if (hasCommonElement) {
                        //   return true;
                        // }
                        // console.log(connection);
                        return true;
                      }}
                      className={
                        'p-[2px] rounded-[2px!important] border border-[#000!important] bg-[#fff!important]  dark:bg-dark-system-bg-primary bg-light-system-bg-primary  right-[-4px!important]'
                      }
                      position={Position.Right} // style={{
                      //   borderColor: color,
                      //   top: position
                      // }}
                    ></Handle>
                  </Tooltip>
                  {output?.name}(
                  {typeof output?.type === 'string' ? output?.type : output?.type?.[0]?.type})
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const GetFuryInput = (data: FuryData, name: string, type: string, index: number) => {
  const ref = useRef(null) as any;
  const updateNodeInternals = useUpdateNodeInternals();
  const [value, setValue] = useState(
    data.node?.fn?.model_params?.[name] ?? data.node.fields[index].placeholder
  );

  useEffect(() => {
    updateNodeInternals(data.id);
  }, [value]);

  return (
    <div ref={ref} className="flex flex-col gap-[2px] w-full">
      <span>{name}</span>
      {type === 'string' || data.node?.fields[index]?.items?.[0]?.type === 'string' ? (
        <textarea
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (!data.node.fn && data.node) {
              data.node.fn = {
                model_params: {}
              };
            }
            if (data.node.fn && !data.node.fn.model_params) {
              data.node.fn.model_params = {};
            }
            if (data.node.fn) data.node.fn.model_params[name] = e.target.value;
            data.node.fields[index].placeholder = e.target.value;
          }}
          className="nodrag w-full"
          rows={1}
        />
      ) : type === 'object' || data.node?.fields[index]?.items?.[0]?.type === 'object' ? (
        <textarea
          className="nodrag w-full"
          rows={3}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (data.node.fn && !data.node.fn.model_params) {
              data.node.fn.model_params = {};
            }
            if (data.node.fn) data.node.fn.model_params[name] = e.target.value;
            data.node.fields[index].placeholder = e.target.value;

            updateNodeInternals(data.id);
          }}
        />
      ) : type === 'number' || data.node?.fields[index]?.items?.[0]?.type === 'number' ? (
        <input
          value={value}
          onChange={(e) => {
            if (!isNaN(parseInt(e.target.value))) {
              setValue(e.target.value);
              if (data.node.fn && !data.node.fn.model_params) {
                data.node.fn.model_params = {};
              }
              if (data.node.fn) data.node.fn.model_params[name] = Number(e.target.value);
              data.node.fields[index].placeholder = e.target.value;
              updateNodeInternals(data.id);
            }
          }}
          className="nodrag w-full"
          type="number"
        />
      ) : type === 'boolean' || data.node?.fields[index]?.items?.[0]?.type === 'boolean' ? (
        <div className="flex gap-[8px]">
          <div className="flex items-center gap-[4px]">
            <input
              onChange={(e) => {
                setValue(e.target.value);
                if (data.node.fn && !data.node.fn.model_params) {
                  data.node.fn.model_params = {};
                }
                if (data.node.fn) data.node.fn.model_params[name] = true;
                data.node.fields[index].placeholder = 'true';
                updateNodeInternals(data.id);
              }}
              type="radio"
              id="huey"
              name="drone"
              value="huey"
            />
            <label htmlFor="huey">True</label>
          </div>
          <div className="flex items-center gap-[4px]">
            <input
              onChange={(e) => {
                setValue(e.target.value);
                if (data.node.fn && !data.node.fn.model_params) {
                  data.node.fn.model_params = {};
                }
                if (data.node.fn) data.node.fn.model_params[name] = false;
                data.node.fields[index].placeholder = 'false';
                updateNodeInternals(data.id);
              }}
              type="radio"
              id="huey"
              name="drone"
              value="huey"
            />
            <label htmlFor="huey">False</label>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

const AdditionalFieldsModal = ({ data, onClose }: { data: FuryData; onClose: () => void }) => {
  return (
    <>
      <Dialog open={true} onClose={onClose}>
        <div
          className={`prose-nbx relative  gap-[16px] p-[16px] flex flex-col justify-center items-center w-[500px]`}
        >
          <SvgClose
            onClick={onClose}
            className="stroke-light-neutral-grey-900 absolute right-[8px] top-[8px] scale-[1.2] cursor-pointer"
          />

          <div className="flex flex-col w-full">
            {data?.node?.fields?.map((field, key) => {
              return !field.required ? (
                <div key={key} className="flex flex-col gap-[8px] relative w-full">
                  <span className="medium400 text-light-neutral-grey-600 flex items-center gap-[4px] p-[8px]">
                    {typeof field?.type === 'string'
                      ? GetFuryInput(
                          JSON.parse(JSON.stringify(data)),
                          field?.name,
                          field?.type,
                          key
                        )
                      : GetFuryInput(
                          JSON.parse(JSON.stringify(data)),
                          field?.name,
                          field?.type?.[0]?.type,
                          key
                        )}
                    {/* {field?.placeholder} */}
                  </span>
                </div>
              ) : (
                <></>
              );
            })}
          </div>
        </div>
      </Dialog>
    </>
  );
};
