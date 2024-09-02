export class LoopHelper {
    static async delay(timeout: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, timeout));
    }
}
