import sessionsIndexJson from '@/data/sessions-index.json';
import { localSessionDetailsMap } from '@/lib/generated/local-session-details';

export interface LocalSessionIndexItem {
    id: string;
    title: string;
    date: string;
    summary: string;
    status: string;
    phase?: string;
    published?: boolean;
    highlight?: boolean;
}

export interface LocalSessionMetadata {
    id: string;
    title: string;
    date: string;
    summary: string;
    status: string;
    source?: string;
    tags?: string[];
}

export interface LocalTranscriptLine {
    id: string;
    lineId: string;
    type: string;
    role: string;
    speaker: string;
    action: string;
    content: string;
}

export interface LocalSessionDetail {
    metadata: LocalSessionMetadata;
    transcripts: LocalTranscriptLine[];
}

export const sessionsIndex = sessionsIndexJson as LocalSessionIndexItem[];

export function getLocalSessionsIndex(): LocalSessionIndexItem[] {
    return sessionsIndex;
}

export function getLocalSessionDetail(id: string): LocalSessionDetail | null {
    const raw = localSessionDetailsMap[id as keyof typeof localSessionDetailsMap];
    if (!raw) return null;

    const transcripts = (raw.transcripts || []).map((item: any, index: number) => ({
        id: item.id ?? `line-${index + 1}`,
        lineId: item.lineId ?? item.id ?? `${index + 1}`,
        type: item.type ?? 'dialogue',
        role: item.role ?? item.speaker ?? '',
        speaker: item.speaker ?? item.role ?? '',
        action: item.action ?? '',
        content: item.content ?? '',
    })) as LocalTranscriptLine[];

    return {
        metadata: raw.metadata as LocalSessionMetadata,
        transcripts,
    };
}

export function getTranscriptCitationMap(sessionId: string): Record<string, LocalTranscriptLine> {
    const session = getLocalSessionDetail(sessionId);
    if (!session) return {};

    return session.transcripts.reduce<Record<string, LocalTranscriptLine>>((acc, line) => {
        acc[line.lineId] = line;
        acc[line.id] = line;
        return acc;
    }, {});
}
