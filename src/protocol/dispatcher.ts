import {
	ProtocolMessage,
	UpdateBufferParams,
	UpdateCursorParams,
} from "./messages";

interface DispatcherHandlers {
	updateCursor: (params: UpdateCursorParams) => void;
	updateBuffer: (params: UpdateBufferParams) => Promise<void>;
}

export function createDispatcher(handlers: DispatcherHandlers) {
	return async (message: ProtocolMessage): Promise<void> => {
		switch (message.method) {
			case "updateCursor":
				handlers.updateCursor(message.params);
				return;

			case "updateBuffer":
				await handlers.updateBuffer(message.params);
				return;

			default: {
				const _exhaustive: never = message;
				return _exhaustive;
			}
		}
	};
}
