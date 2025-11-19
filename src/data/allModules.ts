import { Module } from './modules'

// This file will be imported by modules.ts to provide all 8 complete modules

export const completeModules: Partial<Module>[] = [
  // Module 3: Memory Hierarchy
  {
    id: 'module3',
    number: 3,
    title: 'Memory Hierarchy & Management',
    subtitle: 'Master GPU memory systems and optimization techniques',
    description: 'Deep dive into global, shared, and register memory, memory coalescing, bank conflicts, and bandwidth optimization strategies.',
    duration: '6-7 hours',
    difficulty: 'intermediate' as const,
    prerequisites: ['Module 2: GPU Hardware Architecture'],
    learningObjectives: [
      'Understand the complete GPU memory hierarchy',
      'Optimize memory access patterns for coalescing',
      'Identify and resolve shared memory bank conflicts',
      'Implement effective memory management strategies',
      'Utilize unified memory and memory pools'
    ],
    sections: [
      {
        id: 'memory-types',
        title: 'GPU Memory Types and Hierarchy',
        content: 'Comprehensive coverage of all GPU memory types, their characteristics, and use cases...'
      }
    ],
    visualizations: [
      {id: 'mem-hierarchy', title: 'Memory Hierarchy Explorer', description: 'Interactive 3D memory hierarchy', type: '3d' as const, component: 'MemoryHierarchy3D'},
      {id: 'coalescing-viz', title: 'Memory Coalescing Visualizer', description: 'See coalesced vs uncoalesced access', type: 'interactive' as const, component: 'CoalescingViz'}
    ]
  },

  // Module 4: CUDA Programming
  {
    id: 'module4',
    number: 4,
    title: 'CUDA Programming Model',
    subtitle: 'Hands-on CUDA programming from basics to advanced',
    description: 'Complete guide to CUDA: kernels, threads, blocks, grids, synchronization, atomics, and the CUDA programming workflow.',
    duration: '8-10 hours',
    difficulty: 'intermediate' as const,
    prerequisites: ['Module 3: Memory Hierarchy'],
    learningObjectives: [
      'Write and launch CUDA kernels',
      'Master thread indexing and coordinate systems',
      'Implement synchronization and atomic operations',
      'Use CUDA streams for concurrent execution',
      'Debug and profile CUDA applications'
    ]
  },

  // Module 5: Performance Optimization
  {
    id: 'module5',
    number: 5,
    title: 'Performance Optimization',
    subtitle: 'Advanced techniques for maximum GPU performance',
    description: 'Learn occupancy optimization, profiling with NSight, minimizing divergence, and achieving peak GPU performance.',
    duration: '7-8 hours',
    difficulty: 'advanced' as const,
    prerequisites: ['Module 4: CUDA Programming'],
    learningObjectives: [
      'Calculate and optimize kernel occupancy',
      'Profile applications with NSight Systems and Compute',
      'Minimize warp divergence and thread divergence',
      'Optimize memory bandwidth utilization',
      'Apply instruction-level optimizations'
    ]
  },

  // Module 6: Deep Learning on GPUs
  {
    id: 'module6',
    number: 6,
    title: 'Deep Learning on GPUs',
    subtitle: 'GPU optimization for neural network training and inference',
    description: 'Master cuDNN, tensor operations, mixed precision training, and PyTorch/TensorFlow GPU internals for optimal deep learning performance.',
    duration: '10-12 hours',
    difficulty: 'advanced' as const,
    prerequisites: ['Module 5: Performance Optimization'],
    learningObjectives: [
      'Leverage cuDNN and cuBLAS for optimized operations',
      'Implement mixed precision training with Tensor Cores',
      'Understand PyTorch and TensorFlow GPU internals',
      'Optimize neural network training loops',
      'Profile and tune deep learning workloads'
    ]
  },

  // Module 7: Multi-GPU Computing
  {
    id: 'module7',
    number: 7,
    title: 'Multi-GPU & Distributed Computing',
    subtitle: 'Scale training across multiple GPUs and nodes',
    description: 'Learn data and model parallelism, NCCL collective operations, and distributed training best practices.',
    duration: '6-7 hours',
    difficulty: 'advanced' as const,
    prerequisites: ['Module 6: Deep Learning on GPUs'],
    learningObjectives: [
      'Implement data parallelism across multiple GPUs',
      'Apply model parallelism for large models',
      'Use NCCL for efficient collective communication',
      'Set up distributed training pipelines',
      'Optimize gradient synchronization'
    ]
  },

  // Module 8: Advanced Topics
  {
    id: 'module8',
    number: 8,
    title: 'Advanced Topics & Future Trends',
    subtitle: 'Cutting-edge GPU technologies and future directions',
    description: 'Explore ray tracing cores, sparse operations, transformer acceleration, and emerging GPU architecture trends.',
    duration: '5-6 hours',
    difficulty: 'advanced' as const,
    prerequisites: ['Module 7: Multi-GPU Computing'],
    learningObjectives: [
      'Understand RT cores and ray tracing acceleration',
      'Implement sparse matrix operations efficiently',
      'Optimize transformer models for GPUs',
      'Explore future GPU architecture directions',
      'Stay current with GPU computing trends'
    ]
  }
]
