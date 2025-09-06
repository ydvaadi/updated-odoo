import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, MessageSquare, Users, Calendar, CheckSquare, MoreHorizontal, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AvatarInitials } from "@/components/ui/avatar-initials";
import { apiService, Project, Task, Message } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
  const [newTaskDialog, setNewTaskDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assigneeId: '',
    dueDate: '',
    priority: 'MEDIUM' as const,
  });
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMessage, setNewMessage] = useState('');
  
  const { toast } = useToast();

  // Load project data on mount
  useEffect(() => {
    const loadProjectData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const [projectData, tasksData, messagesData] = await Promise.all([
          apiService.getProject(id),
          apiService.getTasks(id),
          apiService.getMessages(id)
        ]);
        
        setProject(projectData);
        setTasks(tasksData);
        setMessages(messagesData);
        setMembers(projectData.memberships?.map(m => m.user) || []);
      } catch (error) {
        console.error('Failed to load project data:', error);
        toast({
          title: "Error",
          description: "Failed to load project data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectData();
  }, [id, toast]);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <Link to="/projects">
          <Button variant="outline">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  const handleCreateTask = async () => {
    if (!newTask.title.trim() || !id) return;

    try {
      const task = await apiService.createTask(
        id,
        newTask.title,
        newTask.description,
        newTask.assigneeId || undefined,
        newTask.dueDate || undefined,
        newTask.priority
      );
      
      setTasks([...tasks, task]);
      setNewTask({ title: '', description: '', assigneeId: '', dueDate: '', priority: 'MEDIUM' });
      setNewTaskDialog(false);
      
      toast({
        title: "Task created!",
        description: `${newTask.title} has been added to the project.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTaskStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      const updatedTask = await apiService.updateTask(taskId, undefined, undefined, newStatus);
      setTasks(tasks.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      
      toast({
        title: "Task updated!",
        description: "Task status has been changed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !id) return;

    try {
      const message = await apiService.createMessage(id, newMessage);
      setMessages([...messages, message]);
      setNewMessage('');
      
      toast({
        title: "Message sent!",
        description: "Your message has been added to the discussion.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'TODO': return 'status-todo';
      case 'IN_PROGRESS': return 'status-progress';
      case 'DONE': return 'status-done';
      default: return 'status-todo';
    }
  };

  const getStatusLabel = (status: Task['status']) => {
    switch (status) {
      case 'TODO': return 'To Do';
      case 'IN_PROGRESS': return 'In Progress';
      case 'DONE': return 'Done';
      default: return 'To Do';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground mt-1">{project.description}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Project Tasks</h2>
            <Button onClick={() => setNewTaskDialog(true)} variant="hero">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>

          <div className="grid gap-4">
            {tasks.map((task) => (
              <Card key={task.id} className="card-interactive">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{task.title}</h3>
                        <Badge className={getStatusColor(task.status)}>
                          {getStatusLabel(task.status)}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">{task.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {task.assignee && (
                          <div className="flex items-center gap-1">
                            <AvatarInitials initials={task.assignee.name.slice(0, 2).toUpperCase()} size="sm" />
                            <span>{task.assignee.name}</span>
                          </div>
                        )}
                        {task.dueDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleTaskStatusChange(task.id, 'TODO')}>
                          Mark as To Do
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTaskStatusChange(task.id, 'IN_PROGRESS')}>
                          Mark as In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTaskStatusChange(task.id, 'DONE')}>
                          Mark as Done
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}

            {tasks.length === 0 && (
              <Card className="card-elevated">
                <CardContent className="p-12 text-center">
                  <CheckSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first task to start organizing work for this project.
                  </p>
                  <Button onClick={() => setNewTaskDialog(true)} variant="hero">
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Task
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="discussion" className="space-y-4">
          <h2 className="text-xl font-semibold">Team Discussion</h2>
          
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {messages.map((message) => (
                  <div key={message.id} className="flex gap-3">
                    <AvatarInitials initials={message.author.name.slice(0, 2).toUpperCase()} size="sm" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{message.author.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
                
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 pt-4 border-t">
                <Input
                  placeholder="Write a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Project Members</h2>
            <Button onClick={() => setIsMemberDialogOpen(true)} variant="hero">
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </div>

          <div className="grid gap-4">
            {members.map((member) => (
              <Card key={member.id} className="card-elevated">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <AvatarInitials initials={member.name.slice(0, 2).toUpperCase()} />
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Task Creation Dialog */}
      <Dialog open={newTaskDialog} onOpenChange={setNewTaskDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task to this project and assign it to a team member.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Task Title</Label>
              <Input
                id="task-title"
                placeholder="Enter task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                placeholder="Describe the task requirements"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task-assignee">Assignee</Label>
                <Select value={newTask.assigneeId} onValueChange={(value) => setNewTask({ ...newTask, assigneeId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-due-date">Due Date</Label>
                <Input
                  id="task-due-date"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewTaskDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTask} disabled={!newTask.title.trim()}>
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={isMemberDialogOpen} onOpenChange={setIsMemberDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Invite a new team member to collaborate on this project.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="member-email">Email Address</Label>
              <Input
                id="member-email"
                type="email"
                placeholder="Enter team member's email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMemberDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast({
                title: "Invitation sent!",
                description: `An invitation has been sent to ${newMemberEmail}.`,
              });
              setNewMemberEmail('');
              setIsMemberDialogOpen(false);
            }} disabled={!newMemberEmail.trim()}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}