import React, { useState, useEffect } from 'react';
import { Send, Smile, Paperclip, Image as ImageIcon } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { format } from 'date-fns';
import { useStore } from '../../lib/store';
import { supabase } from '../../lib/supabase';

interface Message {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  attachments?: string[];
  user: {
    username: string;
    avatar_url?: string;
  };
}

interface TeamChatProps {
  teamId: string;
}

export function TeamChat({ teamId }: TeamChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useStore();

  useEffect(() => {
    if (teamId) {
      fetchMessages();
      subscribeToMessages();
    }
  }, [teamId]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('team_messages')
        .select(`
          id,
          user_id,
          content,
          created_at,
          attachments,
          user:users!team_messages_user_id_fkey (
            username,
            avatar_url
          )
        `)
        .eq('team_id', teamId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      if (data) {
        setMessages(data.reverse());
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel(`team_${teamId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'team_messages',
          filter: `team_id=eq.${teamId}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const handleSendMessage = async () => {
    if (!user || !newMessage.trim()) return;

    try {
      const { error } = await supabase.from('team_messages').insert([
        {
          team_id: teamId,
          user_id: user.id,
          content: newMessage.trim(),
        },
      ]);

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm flex flex-col h-[600px]">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold">Team Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.user_id === user?.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] ${
                message.user_id === user?.id
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100'
              } rounded-lg p-3`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium">
                  {message.user.username}
                </span>
                <span className="text-xs opacity-75">
                  {format(new Date(message.created_at), 'h:mm a')}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{message.content}</p>
              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.attachments.map((attachment, index) => (
                    <img
                      key={index}
                      src={attachment}
                      alt="Attachment"
                      className="max-w-[200px] rounded"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <TextareaAutosize
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
              maxRows={4}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>
          <div className="flex space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Smile className="h-5 w-5 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Paperclip className="h-5 w-5 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ImageIcon className="h-5 w-5 text-gray-500" />
            </button>
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}