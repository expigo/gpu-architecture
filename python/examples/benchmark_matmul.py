"""
Matrix Multiplication Benchmark: CPU vs GPU
Module 1: Introduction to GPU Computing

This script benchmarks matrix multiplication performance across different sizes
to demonstrate GPU advantages for parallel operations.
"""

import torch
import time
import numpy as np
import matplotlib.pyplot as plt


def benchmark_matmul(size, device='cpu', num_runs=10, warmup=3):
    """
    Benchmark matrix multiplication on specified device.

    Args:
        size: Matrix dimension (size x size)
        device: 'cpu' or 'cuda'
        num_runs: Number of runs for averaging
        warmup: Number of warmup runs

    Returns:
        Average time in seconds, GFLOPS
    """
    # Create random matrices
    A = torch.randn(size, size, device=device)
    B = torch.randn(size, size, device=device)

    # Warmup runs
    for _ in range(warmup):
        C = torch.matmul(A, B)

    if device == 'cuda':
        torch.cuda.synchronize()

    # Benchmark runs
    start = time.time()
    for _ in range(num_runs):
        C = torch.matmul(A, B)

    if device == 'cuda':
        torch.cuda.synchronize()

    end = time.time()
    avg_time = (end - start) / num_runs

    # Calculate FLOPS (FLoating point OPerations per Second)
    # Matrix multiplication: 2*n^3 operations for n x n matrices
    flops = 2 * size**3
    gflops = (flops / avg_time) / 1e9

    return avg_time, gflops


def run_benchmark_suite():
    """Run comprehensive benchmark across multiple matrix sizes."""

    sizes = [128, 256, 512, 1024, 2048, 4096, 8192]

    print("="*70)
    print("Matrix Multiplication Benchmark: CPU vs GPU")
    print("="*70)

    results = {
        'sizes': sizes,
        'cpu_times': [],
        'gpu_times': [],
        'cpu_gflops': [],
        'gpu_gflops': [],
        'speedups': []
    }

    for size in sizes:
        print(f"\n{'Size':<10} {'CPU Time':<15} {'GPU Time':<15} {'Speedup':<10} {'CPU GFLOPS':<15} {'GPU GFLOPS':<15}")
        print("-"*80)

        # CPU benchmark
        cpu_time, cpu_gflops = benchmark_matmul(size, device='cpu', num_runs=5)
        results['cpu_times'].append(cpu_time)
        results['cpu_gflops'].append(cpu_gflops)

        # GPU benchmark (if available)
        if torch.cuda.is_available():
            gpu_time, gpu_gflops = benchmark_matmul(size, device='cuda', num_runs=10)
            results['gpu_times'].append(gpu_time)
            results['gpu_gflops'].append(gpu_gflops)

            speedup = cpu_time / gpu_time
            results['speedups'].append(speedup)

            print(f"{size}x{size:<5} {cpu_time*1000:>10.2f} ms {gpu_time*1000:>10.2f} ms {speedup:>8.2f}x {cpu_gflops:>10.2f} {gpu_gflops:>12.2f}")
        else:
            results['gpu_times'].append(0)
            results['gpu_gflops'].append(0)
            results['speedups'].append(0)
            print(f"{size}x{size:<5} {cpu_time*1000:>10.2f} ms {'N/A':<15} {'N/A':<10} {cpu_gflops:>10.2f} {'N/A':<15}")

    return results


def plot_results(results):
    """Create visualization of benchmark results."""

    if not torch.cuda.is_available():
        print("\nSkipping plots - GPU not available")
        return

    fig, axes = plt.subplots(2, 2, figsize=(14, 10))
    fig.suptitle('CPU vs GPU Matrix Multiplication Performance', fontsize=16, fontweight='bold')

    sizes = results['sizes']

    # Plot 1: Execution Time
    ax1 = axes[0, 0]
    ax1.plot(sizes, [t*1000 for t in results['cpu_times']], 'o-', label='CPU', linewidth=2, markersize=8)
    ax1.plot(sizes, [t*1000 for t in results['gpu_times']], 's-', label='GPU', linewidth=2, markersize=8)
    ax1.set_xlabel('Matrix Size', fontsize=12)
    ax1.set_ylabel('Time (ms)', fontsize=12)
    ax1.set_title('Execution Time', fontsize=14)
    ax1.legend(fontsize=11)
    ax1.grid(True, alpha=0.3)
    ax1.set_xscale('log')
    ax1.set_yscale('log')

    # Plot 2: GFLOPS
    ax2 = axes[0, 1]
    ax2.plot(sizes, results['cpu_gflops'], 'o-', label='CPU', linewidth=2, markersize=8)
    ax2.plot(sizes, results['gpu_gflops'], 's-', label='GPU', linewidth=2, markersize=8)
    ax2.set_xlabel('Matrix Size', fontsize=12)
    ax2.set_ylabel('GFLOPS', fontsize=12)
    ax2.set_title('Computational Throughput', fontsize=14)
    ax2.legend(fontsize=11)
    ax2.grid(True, alpha=0.3)

    # Plot 3: Speedup
    ax3 = axes[1, 0]
    ax3.plot(sizes, results['speedups'], 'o-', color='green', linewidth=2, markersize=8)
    ax3.set_xlabel('Matrix Size', fontsize=12)
    ax3.set_ylabel('Speedup Factor', fontsize=12)
    ax3.set_title('GPU Speedup over CPU', fontsize=14)
    ax3.grid(True, alpha=0.3)
    ax3.axhline(y=1, color='r', linestyle='--', alpha=0.5, label='No speedup')
    ax3.legend(fontsize=11)

    # Plot 4: Summary Table
    ax4 = axes[1, 1]
    ax4.axis('off')

    table_data = []
    for i, size in enumerate(sizes[-4:]):  # Last 4 sizes
        table_data.append([
            f"{size}x{size}",
            f"{results['cpu_times'][-4:][i]*1000:.2f} ms",
            f"{results['gpu_times'][-4:][i]*1000:.2f} ms",
            f"{results['speedups'][-4:][i]:.2f}x"
        ])

    table = ax4.table(cellText=table_data,
                     colLabels=['Size', 'CPU Time', 'GPU Time', 'Speedup'],
                     cellLoc='center',
                     loc='center')
    table.auto_set_font_size(False)
    table.set_fontsize(10)
    table.scale(1, 2)

    # Style header
    for i in range(4):
        table[(0, i)].set_facecolor('#76b900')
        table[(0, i)].set_text_props(weight='bold', color='white')

    ax4.set_title('Performance Summary (Large Matrices)', fontsize=14, pad=20)

    plt.tight_layout()
    plt.savefig('gpu_benchmark_results.png', dpi=300, bbox_inches='tight')
    print("\n✓ Results plotted and saved to 'gpu_benchmark_results.png'")
    plt.show()


def estimate_training_speedup():
    """Estimate speedup for a typical deep learning training scenario."""

    if not torch.cuda.is_available():
        print("\nGPU not available for training speedup estimation")
        return

    print("\n" + "="*70)
    print("Deep Learning Training Speedup Estimation")
    print("="*70)

    # Simulate a small neural network layer
    batch_size = 64
    input_size = 1024
    hidden_size = 2048

    print(f"\nSimulating neural network layer:")
    print(f"  Batch size: {batch_size}")
    print(f"  Input size: {input_size}")
    print(f"  Hidden size: {hidden_size}")

    # Create synthetic data
    X_cpu = torch.randn(batch_size, input_size)
    W_cpu = torch.randn(input_size, hidden_size)

    # CPU forward pass
    start = time.time()
    for _ in range(100):
        Y_cpu = torch.matmul(X_cpu, W_cpu)
        Y_cpu = torch.relu(Y_cpu)
    cpu_time = time.time() - start

    # GPU forward pass
    X_gpu = X_cpu.cuda()
    W_gpu = W_cpu.cuda()

    # Warmup
    Y_gpu = torch.relu(torch.matmul(X_gpu, W_gpu))
    torch.cuda.synchronize()

    start = time.time()
    for _ in range(100):
        Y_gpu = torch.matmul(X_gpu, W_gpu)
        Y_gpu = torch.relu(Y_gpu)
    torch.cuda.synchronize()
    gpu_time = time.time() - start

    speedup = cpu_time / gpu_time

    print(f"\n100 forward passes:")
    print(f"  CPU: {cpu_time*1000:.2f} ms")
    print(f"  GPU: {gpu_time*1000:.2f} ms")
    print(f"  Speedup: {speedup:.2f}x")

    # Extrapolate to full training
    epochs = 100
    steps_per_epoch = 1000
    total_operations = epochs * steps_per_epoch

    estimated_cpu_hours = (cpu_time * total_operations) / 3600
    estimated_gpu_hours = (gpu_time * total_operations) / 3600

    print(f"\nEstimated training time ({epochs} epochs, {steps_per_epoch} steps/epoch):")
    print(f"  CPU: {estimated_cpu_hours:.2f} hours")
    print(f"  GPU: {estimated_gpu_hours:.2f} hours")
    print(f"  Time saved: {estimated_cpu_hours - estimated_gpu_hours:.2f} hours")


def main():
    """Main function."""

    print("\n" + "="*70)
    print("GPU Architecture Course - Matrix Multiplication Benchmark")
    print("="*70 + "\n")

    if not torch.cuda.is_available():
        print("⚠ Warning: CUDA GPU not available!")
        print("  Running CPU-only benchmarks...\n")
    else:
        gpu_name = torch.cuda.get_device_name(0)
        print(f"✓ GPU detected: {gpu_name}\n")

    # Run benchmarks
    results = run_benchmark_suite()

    # Plot results
    if torch.cuda.is_available():
        try:
            plot_results(results)
        except Exception as e:
            print(f"\nCouldn't create plots: {e}")

        # Training speedup estimation
        estimate_training_speedup()

    print("\n" + "="*70)
    print("Benchmark complete!")
    print("="*70 + "\n")


if __name__ == "__main__":
    main()
